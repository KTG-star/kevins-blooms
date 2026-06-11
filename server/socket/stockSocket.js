let ioInstance;

const init = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    socket.on('joinOrder', (orderId) => {
      socket.join(orderId);
      console.log(`Socket ${socket.id} joined order room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id);
    });
  });
};

const emitStockUpdate = (flowerId, newQuantity) => {
  if (ioInstance) {
    ioInstance.emit('stockUpdate', { flowerId, newQuantity });
  }
};

const emitOrderStatusUpdate = (orderId, status) => {
  if (ioInstance) {
    ioInstance.to(orderId).emit('orderStatusUpdate', { orderId, status });
  }
};

module.exports = init;
module.exports.emitStockUpdate = emitStockUpdate;
module.exports.emitOrderStatusUpdate = emitOrderStatusUpdate;
