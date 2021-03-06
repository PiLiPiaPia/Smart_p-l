const _ = require('lodash');
const {assert, mongo: {Borrow, Lend, Message, LoanTransaction, User, TimelineItem}} = require('../../lib');
const {ObjectId} = require('mongoose').Types;
const {fields} = require('../../config');

exports.borrow = async (req, res) => {
  //  1. 生成借款实例、加到自己的业务消息
  //  2. 朋友圈推送
  const data = _.pick(
    req.body,
    ['city', 'project', 'max_amount', 'reason', 'max_rate', 'loan_ddl', 'other_detail', 'mortgage_value', 'guarentee_amount', 'supportSales', 'supportOther', 'risk_factor', 'total_risk_factor', 'mortgage', 'guarentee', 'mortgage_fixed', 'mortgage_other']
  );
  data.from = res.locals.user._id;
  const borrowInstance = new Borrow(data);
  assert(!(borrowInstance.validateSync() instanceof Error), 'invalid data');
  const timelineItem = new TimelineItem({
    from: res.locals.user._id,
    type: 'Borrow',
    info: {
      borrowId: borrowInstance._id
    }
  });
  const message = new Message({
    type: 'Publish-Borrow',
    info: {
      borrowId: borrowInstance._id
    }
  });
  await Promise.all([
    borrowInstance.save(),
    res.locals.user.addTimeline(timelineItem),
    message.save(),
    res.locals.user.addMessage(message)
  ]);

  res.json(borrowInstance._id);
};

exports.getBorrow = async (req, res) => {
  const {id} = req.query;
  assert(id, 'borrow-id required');
  assert(ObjectId.isValid(id), 'invalid id');
  const borrowInstance = await Borrow
    .findById(id)
    .populate({
      path: 'from',
      select: fields.stranger
    });
  assert(borrowInstance, 'borrow-instance not exist');

  res.json(borrowInstance);
};

exports.getLend = async (req, res) => {
  const {id} = req.query;
  assert(id, 'lend-id required');
  assert(ObjectId.isValid(id), 'invalid id');
  const lendInstance = await Lend
    .findById(id)
    .populate({
      path: 'from',
      select: fields.stranger
    });
  assert(lendInstance, 'lend-instance not exist');

  res.json(lendInstance);
};

exports.lend = async (req, res) => {
  //  1. 生成放款实例、加到自己的业务消息
  //  2. 朋友圈推送
  const data = _.pick(
    req.body,
    ['max_amount', 'loan_ddl']
  );
  data.from = res.locals.user._id;
  const lendInstance = new Lend(data);
  assert(!(lendInstance.validateSync() instanceof Error), 'invalid data');
  const message = new Message({
    type: 'Publish-Lend',
    info: {
      lendId: lendInstance._id
    }
  });
  await Promise.all([
    lendInstance.save(),
    message.save(),
    res.locals.user.addMessage(message)
  ]);

  res.json(lendInstance._id);
};

exports.getMyBorrow = async (req, res) => {
  const result = await Borrow.find({from: res.locals.user});
  res.json(result);
};

exports.getMyLend = async (req, res) => {
  const result = await Lend.find({from: res.locals.user});
  res.json(result);
};

exports.getRecommend = async (req, res) => {
  // 根据借款实例id返回推荐的借款活动
  const {id} = req.query;
  assert(id, 'borrow-id required');
  assert(ObjectId.isValid(id), 'invalid id');
  const borrowInstance = await Borrow.findById(id);
  assert(borrowInstance, 'borrow-instance not exist');

  const result = await Lend
    .find({
      'loan_ddl': {
        $gte: borrowInstance.loan_ddl
      },
      from: { // exclude those from yourself
        $ne: res.locals.user._id,
        $in: res.locals.user.friends
      }
    })
    .sort('-max_amount')
    .limit(3); // only return top three
  res.json(result);
};

exports.getRelatedMessages = async (req, res) => {
  const result = await User.findById(res.locals.user._id).populate({
    path: 'messages',
    match: {
      type: /^Borrow|^Publish-Lend|^Publish-Borrow/
    },
    populate: {
      path: 'info.transactionId',
      model: 'LoanTransaction'
    }
  });
  const messages = result.toObject().messages;
  messages.forEach(m => {
    m.info.transaction = m.info.transactionId;
    delete m.info.transactionId;
  });
  res.json(messages);
};

exports.request = async (req, res) => {
  //   1. 向一个放款实例发出申请
  //     * 生成事务实例
  //     * 双方发消息
  const {borrowId, lendId} = req.body;
  assert(borrowId, 'borrow-id required');
  assert(ObjectId.isValid(borrowId), 'invalid borrow-id');
  const borrowInstance = await Borrow.findById(borrowId);
  assert(borrowInstance, 'borrow-instance not exist');

  assert(lendId, 'lend-id required');
  assert(ObjectId.isValid(lendId), 'invalid lend-id');
  const lendInstance = await Lend.findById(lendId);
  assert(lendInstance, 'lend-instance not exist');

  assert(borrowInstance.from.toString() !== lendInstance.from.toString(), `self request`);

  const transaction = new LoanTransaction({
    from: res.locals.user._id,
    lend: lendInstance._id,
    borrow: borrowInstance._id
  });
  const message = new Message({
    type: 'BorrowRequest-Received',
    from: res.locals.user._id,
    info: {
      transactionId: transaction._id
    }
  });
  const messageToSender = new Message({
    type: 'BorrowRequest-Sent',
    info: {
      transactionId: transaction._id
    }
  });

  await Promise.all([
    transaction.save(),
    message.save(),
    messageToSender.save(),
    User.addMessage(lendInstance.from, message),
    res.locals.user.addMessage(messageToSender)
  ]);
  res.end('ok');
};

exports.acceptRequest = async (req, res) => {
  //   1. 接受一个事务申请，将事务推进一个阶段
  //     * 双方发消息

  // const {transactionId} = req.body;
  // assert(transactionId, 'transaction-id required');
  // assert(ObjectId.isValid(transactionId), 'invalid transaction-id');
  // const transaction = await LoanTransaction.findById(transactionId);
  // assert(transaction, 'transaction-instance not exist');
  // assert(transaction.status === 'Request', 'incorrect transaction status');

  const {messageId} = req.body;
  assert(messageId, 'message-id required');
  assert(ObjectId.isValid(messageId), 'invalid message-id');
  const message = await Message.findById(messageId);
  assert(message, 'message-instance not exist');
  assert(message.type === 'BorrowRequest-Received', 'incorrect message type');

  const messageToBorrower = new Message({
    type: 'BorrowRequest-Accepted',
    from: res.locals.user._id,
    info: {
      transactionId: message.info.transactionId
    }
  });

  await Promise.all([
    message.update({$set: {type: 'BorrowRequest-Received&Accepted'}}),
    messageToBorrower.save(),
    LoanTransaction.update({_id: message.info.transactionId}, {$set: {status: 'Progressing'}}),
    User.addMessage(message.from, messageToBorrower)
  ]);

  res.end('ok');
};

exports.sendTransaction = async (req, res) => {
  //   发送合同信息
  const {messageId} = req.body;
  assert(messageId, 'message-id required');
  assert(ObjectId.isValid(messageId), 'invalid message-id');
  const message = await Message.findById(messageId);
  assert(message, 'message-instance not exist');
  assert(message.type === 'BorrowRequest-Accepted', 'incorrect message type');

  assert(!await Message.findOne({
    type: 'BorrowContract-Sent',
    info: {
      transactionId: message.info.transactionId
    }
  }), 'no duplicate transaction allowed');

  const messageToLender = new Message({
    type: 'BorrowContract-Received',
    from: res.locals.user._id,
    info: {
      transactionId: message.info.transactionId
    }
  });
  const messageToBorrower = new Message({
    type: 'BorrowContract-Sent',
    info: {
      transactionId: message.info.transactionId
    }
  });

  await Promise.all([
    messageToLender.save(),
    messageToBorrower.save(),
    User.addMessage(message.from, messageToLender),
    res.locals.user.addMessage(messageToBorrower)
  ]);

  res.end('ok');
};

exports.acceptTransaction = async (req, res) => {
  //   1. 接受一个交易实例
  //     * 双方发消息
  //     * 完成交易
  const {messageId} = req.body;
  assert(messageId, 'message-id required');
  assert(ObjectId.isValid(messageId), 'invalid message-id');
  const message = await Message.findById(messageId);
  assert(message, 'message-instance not exist');
  assert(message.type === 'BorrowContract-Received', 'incorrect message type');

  const messageToBorrower = new Message({
    type: 'BorrowContract-Accepted',
    from: res.locals.user._id,
    info: {
      transactionId: message.info.transactionId
    }
  });
  const completeMessage = new Message({
    type: 'Borrow-Completed',
    info: {
      transactionId: message.info.transactionId
    }
  });

  await Promise.all([
    messageToBorrower.save(),
    completeMessage.save(),
    User.addMessage(message.from, completeMessage, messageToBorrower),
    res.locals.user.addMessage(completeMessage),
    message.update({$set: {type: 'BorrowContract-Received&Accepted'}}),
    LoanTransaction.update({_id: message.info.transactionId}, {
      $set: {status: 'Completed'}
    })
  ]);

  res.end('ok');
};
