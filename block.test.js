const Block = require("./block");
const { MINE_RATE, GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = 2000;
  const lastHash = "last-hash";
  const hash = "hash";
  const data = ["Blockchain", "Test Data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  });

  it("has timestamp property", () => {
    expect(block.timestamp).toEqual(timestamp);
  });

  it("has lashHash property", () => {
    expect(block.lastHash).toEqual(lastHash);
  });

  it("has hash property", () => {
    expect(block.hash).toEqual(hash);
  });

  it("has data property", () => {
    expect(block.data).toEqual(data);
  });

  it("has nonce property", () => {
    expect(block.nonce).toEqual(nonce);
  });

  it("has difficulty property", () => {
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    it("returns a block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mine()", () => {
    const lastBlock = Block.genesis();
    const data = "Mined data";
    const minedBlock = Block.mine({ lastBlock, data });

    it("returns a block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets 'lastHash' to be the 'hash' of the lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the 'data'", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets the 'timestamp'", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("sets the 'hash' based on proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.lastHash,
          minedBlock.data,
          minedBlock.nonce,
          minedBlock.difficulty
        )
      );
    });

    it("sets the 'hash' that matches the difficulty criteria", () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });

    it("adjusts the difficulty", () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("raises the difficulty for a quickly mined block", () => {
      expect(Block.adjustDifficulty({
        lastBlock: block,
        timestamp: block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty for a slowly mined block", () => {
      expect(Block.adjustDifficulty({
        lastBlock: block,
        timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1", () => {
       block.difficulty = -1;
      expect(Block.adjustDifficulty({
        lastBlock: block,
      })).toEqual(1);
    });
  });
});
