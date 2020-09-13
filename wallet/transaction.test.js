const Transaction = require("./transaction");
const Wallet = require("./index");
const { verifySignature } = require("../util");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient-public-key";
    amount = 50;
    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has an 'id'", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has an 'output'", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the 'senderWallet'", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has an 'input'", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has a 'timestamp' in the 'input'", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("sets the 'amount' to the 'senderWallet' balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the 'address' to the 'senderWallet' publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signs the 'input'", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("isValid()", () => {
    let errorMock;

    beforeEach(() => {
      errorMock = jest.fn();
      console.error = errorMock;
    });

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.isValid(transaction)).toBe(true);
      });
    });

    describe("when the transaction is invalid", () => {
      describe("outputMap value is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[senderWallet.publicKey] = 99999;
          expect(Transaction.isValid(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("input signature is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("data");
          expect(Transaction.isValid(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", () => {
    let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

    describe("the amount is invalid", () => {
      it("throws an error", () => {
        expect(() => {
          transaction.update({
            senderWallet,
            recipient: "next-recipient",
            amount: 999999,
          });
        }).toThrow("Amount exceeds balance");
      });
    });

    describe("the amount is valid", () => {
      beforeEach(() => {
        originalSignature = transaction.input.signature;
        originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
        nextRecipient = "next-recipient";
        nextAmount = 50;
        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        });
      });

      it("outputs the amount to the next recipient", () => {
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      });

      it("subtracts the amount for the sender", () => {
        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
          originalSenderOutput - nextAmount
        );
      });

      it("maintains the total ouput that matches the input amount", () => {
        expect(
          Object.values(transaction.outputMap).reduce(
            (total, amount) => total + amount
          )
        ).toEqual(transaction.input.amount);
      });

      it("re-signs the transaction", () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });

      describe("another update for the same recipient", () => {
        let addedAmount;

        beforeEach(() => {
          addedAmount = 80;
          transaction.update({
            senderWallet,
            recipient: nextRecipient,
            amount: addedAmount,
          });
        });

        it("adds to the recipient", () => {
          expect(transaction.outputMap[nextRecipient]).toEqual(
            nextAmount + addedAmount
          );
        });

        it("should substract from the original sender amount", () => {
          expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          );
        });
      });
    });
  });
});
