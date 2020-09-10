const Block = require("./block");

describe("Block", () => {
  const timestamp = "18/09/2020";
  const lastHash = "last-hash";
  const hash = "hash";
  const data = ["Blockchain", "Test Data"];
  const block = new Block({ timestamp, lastHash, hash, data });

  it("has required properties", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
});
