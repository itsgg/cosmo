const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it("contains a 'chain' array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with a gensis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  describe("addBlock()", () => {
    it("adds a new block to the chain", () => {
      const data = "foobar";
      blockchain.addBlock({ data });
      expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });
  });

  describe("isValid()", () => {
    describe("when the chain does not start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "invalid" };
        expect(Blockchain.isValid(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with genesis block", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "foo" });
        blockchain.addBlock({ data: "bar" });
        blockchain.addBlock({ data: "baz" });
      });

      describe("and lastHash has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "invalid-hash";
          expect(Blockchain.isValid(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "invalid-data";
          expect(Blockchain.isValid(blockchain.chain)).toBe(false);
        });
      });

      describe("and does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValid(blockchain.chain)).toBe(true);
        });
      });
    });
  });
});
