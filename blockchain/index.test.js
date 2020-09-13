const Blockchain = require("./index");
const Block = require("./block");
const { cryptoHash } = require("../util");

describe("Blockchain", () => {
  let blockchain, newBlockchain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newBlockchain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it("contains a 'chain' array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with a gensis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  describe("lastBlock()", () => {
    it("adds a new block to the chain", () => {
      const data = "foobar";
      blockchain.addBlock({ data });
      expect(blockchain.lastBlock).toEqual(
        blockchain.chain[blockchain.chain.length - 1]
      );
    });
  });

  describe("addBlock()", () => {
    it("adds a new block to the chain", () => {
      const data = "foobar";
      blockchain.addBlock({ data });
      expect(blockchain.lastBlock.data).toEqual(data);
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

      describe("and the chains contains a block with jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.lastBlock;
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
          const badBlock = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });
          blockchain.chain.push(badBlock);
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

  describe("replace()", () => {
    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        blockchain.replace(newBlockchain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newBlockchain.addBlock({ data: "foo" });
        newBlockchain.addBlock({ data: "bar" });
        newBlockchain.addBlock({ data: "baz" });
        newBlockchain.addBlock({ data: "xul" });
      });

      describe("when the chain is invalid", () => {
        beforeEach(() => {
          newBlockchain.chain[2].hash = "invalid";
          blockchain.replace(newBlockchain.chain);
        });

        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("when the chain is valid", () => {
        beforeEach(() => {
          blockchain.replace(newBlockchain.chain);
        });

        it("does replace the chain", () => {
          expect(blockchain.chain).toEqual(newBlockchain.chain);
        });

        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
