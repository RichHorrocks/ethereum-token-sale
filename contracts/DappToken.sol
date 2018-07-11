pragma solidity ^0.4.2;

contract DappToken {
    // REQUIRED
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping(address => uint256)) public allowance;

    // OPTIONAL
    string public name = "DappToken";
    string public symbol = "DAPP";

    // NOT ERC-20
    string public standard = "Dapp Token v1.0";

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer tokens.
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Raise an exception if the 'from' account doesn't have enough.
        require(balanceOf[msg.sender] >= _value);

        // Transfer the balance.
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // MUST emit the Transfer event.
        emit Transfer(msg.sender, _to, _value);

        // MUST return a boolean.
        return true;
    }

    // Delegated transfer.
    // Two-step process.
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        // Handle the allowance.
        allowance[msg.sender][_spender] = _value;

        // Approve event.
        emit Approval(msg.sender, _spender, _value);

        // MUST return a boolean.
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Require the from account has the tokens.
        require(balanceOf[_from] >= _value);

        // Require the allowance is big enough.
        require(allowance[_from][msg.sender] >= _value);

        // Change the balance.
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update the allowance.
        allowance[_from][msg.sender] -= _value;

        // MUST emit the Transfer event.
        emit Transfer(_from, _to, _value);

        // Return a boolean.
        return true;
    }

}
