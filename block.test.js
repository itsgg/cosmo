const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = "18/09/2020";
  const lastHash = "last-hash";
  const hash = "hash";
  const data = ["Blockchain", "Test Data"];
  const block = new Block({ timestamp, lastHash, hash, data });

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
        cryptoHash(minedBlock.timestamp, minedBlock.lastHash, minedBlock.data)
      );
    });
  });
});
