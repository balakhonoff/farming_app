const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('DaiToken', ([owner, investor, somebody]) => {
  let daiToken

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new()

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
    await daiToken.transfer(somebody, tokens('200'), { from: owner })


  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
    it('investor has tokens', async () => {
      let balance = await daiToken.balanceOf(investor)
      assert.equal(balance.toString(), tokens('100'))
    })
    it('somebody has tokens', async () => {
      let balance = await daiToken.balanceOf(somebody)
      assert.equal(balance.toString(), tokens('200'))
    })
  })
  describe('Sending tokens', async () => {

    it('investor send tokens to somebody', async () => {
      let result
      let balance

      await daiToken.transfer(somebody, tokens('50'), { from: investor })
      // console.log(result.toString())
      // assert.equal(result.toString(), 'true', 'investor send 50 ether to sombody successfully')

      balance = await daiToken.balanceOf(somebody)
      //console.log(balance.toString())
      assert.equal(balance.toString(), tokens('250'), 'balance of somebody now 250')

      balance = await daiToken.balanceOf(investor)
      assert.equal(balance.toString(), tokens('50'), 'balance of investor now 50')

    })
  })
  describe('delegated sending tokens', async () => {

    it('somebody send tokens to himself approved by investor', async () => {
      let result
      let balance
      await daiToken.approve(somebody, tokens('25'), { from: investor })
      await daiToken.transferFrom(investor, somebody, tokens('25'), { from: somebody })
      // console.log(result.toString())
      // assert.equal(result.toString(), 'true', 'investor send 50 ether to sombody successfully')

      balance = await daiToken.balanceOf(somebody)
      //console.log(balance.toString())
      assert.equal(balance.toString(), tokens('275'), 'balance of somebody now 275')

      balance = await daiToken.balanceOf(investor)
      assert.equal(balance.toString(), tokens('25'), 'balance of investor now 25')


      await daiToken.transferFrom(investor, somebody, tokens('25'), { from: somebody }).should.be.rejected

      await daiToken.approve(somebody, tokens('25'), { from: investor })
      await daiToken.transferFrom(investor, somebody, tokens('26'), { from: somebody }).should.be.rejected

    })
  })
})


contract('TokenFarm', ([owner, investor, somebody]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Dapp Token Farm')
    })

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      let result

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })

      // Check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor })

      // Check results after unstaking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')

      // Check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

    })
  })

})
