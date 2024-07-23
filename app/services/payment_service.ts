export default class PaymentService {
  async processPayment(_orderId: number, _paymentMethod: string, _amount: number) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const isSuccessful = Math.random() < 0.9
    return {
      success: isSuccessful,
      transactionId: isSuccessful ? `TRANS-${Date.now()}` : null,
    }
  }
}
