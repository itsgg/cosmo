const Block = require("./block");
const { GENESIS_DATA } = require("./config");

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
});
