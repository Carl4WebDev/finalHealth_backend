// Abstraction so we can plug PayMongo later with minimal changes.
export default class IPaymentGateway {
  /**
   * @param {object} payload
   *  - amount: number
   *  - currency: string
   *  - paymentMethod: 'cash' | 'gcash' | 'card' | 'bank'
   *  - description: string
   * @returns {Promise<{ status: 'paid' | 'pending' | 'failed', transactionId: string }>}
   */
  async charge(payload) {
    throw new Error("charge() not implemented");
  }
}
