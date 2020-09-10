const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  const blockchain = new Blockchain();

  it("contains a 'chain' array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with a gensis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  describe("addBlock()", () => {
    it("adds a new block to the chain", () => {
      const data = "foobar";
      const chain = blockchain.chain; 
      blockchain.addBlock({ data });
      expect(chain[chain.length - 1].data).toEqual(data);
    });
  });
});
