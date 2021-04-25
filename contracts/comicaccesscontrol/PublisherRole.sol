pragma solidity >=0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DistributorRole' to manage this role - add, remove, check
contract PublisherRole {
  using Roles for Roles.Role;
  // Define 2 events, one for Adding, and other for Removing
  event PublisherAdded(address indexed account);
  event PublisherRemoved(address indexed account);
  // Define a struct 'publishers' by inheriting from 'Roles' library, struct Role
  Roles.Role private publishers;
  // In the constructor make the address that deploys this contract the 1st publisher
  constructor() public {
    _addPublisher(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyPublisher() {
    require(isPublisher(msg.sender));
    _;
  }

  // Define a function 'isDistributor' to check this role
  function isPublisher(address account) public view returns (bool) {
    return publishers.has(account);
  }

  // Define a function 'addDistributor' that adds this role
  function addPublisher(address account) public onlyPublisher {
    _addPublisher(account);
  }

  // Define a function 'renounceDistributor' to renounce this role
  function renouncePublisher() public {
    _removePublisher(msg.sender);
  }

  // Define an internal function '_addDistributor' to add this role, called by 'addDistributor'
  function _addPublisher(address account) internal {
    publishers.add(account);
    emit PublisherAdded(account);
  }

  // Define an internal function '_removeDistributor' to remove this role, called by 'removeDistributor'
  function _removePublisher(address account) internal {
    publishers.remove(account);
    emit PublisherRemoved(account);
  }
}
