const Wallet = require("./index");
const { verifySignature } = require("../util");
const Transaction = require("./transaction");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a 'balance'", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a 'publicKey'", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("sign data", () => {
    const data = "foobar";

    it("verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it("does not verify invalid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe("the amount exceeds the balance", () => {
      it("throws an error", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 9999999,
            recipient: "test-recipient",
          })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("the amount is valid", () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = "test-recipient";
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it("creates a instance of 'Transaction'", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("matches the transaction input with wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("outputs the amount to the recipient", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });
});
