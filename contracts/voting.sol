//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;
import "./ZuriSchoolToken.sol";


<<<<<<< HEAD
///students = ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
///teachers = ["0x617F2E2fD72FD9D5503197092aC168c91465E7f2","0x17F6AD8Ef982297579C203069C1DbfFE4348c372","0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678"]
///director = ["0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7","0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C","0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC"]

/// @dev flow process
/// @dev -1- register address as stakeholders
/// @dev -2- add category
/// @dev -3- register candidates
/// @dev -4- setup election
/// @dev -5- start voting session
/// @dev -6- vote 
/// @dev -7- end voting session
/// @dev -8- compile votes
/// @dev -9- make results public


/// @author TeamB - Blockgames Internship 22
/// @title A Voting Dapp

=======
/** 
* @dev flow process
* @dev -1- register address as stakeholders
* @dev -2- add category
* @dev -3- register candidates
* @dev -4- setup election
* @dev -5- start voting session
* @dev -6- vote 
* @dev -7- end voting session
* @dev -8- compile votes
* @dev -9- make results public
*/ 


/**
* @author TeamB - Blockgames Internship 22
* @title A Voting Dapp
*/
>>>>>>> 236355efbb9c113fb4e666e1b9adf220b2047238
contract ZuriSchool {

    constructor(address _tokenAddr) {
        zstoken = ZuriSchoolToken(_tokenAddr);
        
        /** @notice mint zst to contract owner */
        zstoken.mint(msg.sender, 10000 * decimals);
        
        /** @notice add chairman is the deployer of the contract */
        chairman = msg.sender;
        
        /** @notice add chairman as a stakeholder */
        stakeholders[msg.sender] = Stakeholder("chairman", true, false, 0, 4 );
    }


    /// ---------------------------------------- STRUCT ------------------------------------------ ///
    /** @notice structure for stakeholders */
    struct Stakeholder {
        string role;
        bool isRegistered;
        bool hasVoted;  
        uint votedCandidateId;
        uint256 votingPower;   
    }

    /** @notice structure for candidates */
    struct Candidate {
        uint256   id;
        string name;   
        uint256 category;
        uint voteCount; 
    }
    
    /** @notice structure for election */
    struct Election {
        string category;
        uint256[] candidatesID;
        bool VotingStarted;
        bool VotingEnded;
        bool VotesCounted;
        bool isResultPublic;
        uint256 totalVotesCasted;
    }


    /// ---------------------------------------- VARIABLES ------------------------------------- ///
    /** @notice state variable for tokens */
    ZuriSchoolToken public zstoken;

    /** @notice declare state variable chairman */
    address public chairman;

    /** @notice declare state variable candidatesCount */
    uint public candidatesCount = 0;

    /** @notice id of winner */
    uint private winningCandidateId;

    /** @notice array for categories */
    string[] public categories;

    /** @notice CategoryTrack */
    uint256 count = 1;

    /** @notice decimals */
    uint256 decimals = 10**18;

    /** @notice declare state variable _paused */
    bool public _paused;

    /** @notice election queue */
    Election[] public electionQueue;

    /** @notice election array */
    Election[] public activeElectionArrays;


    /// ------------------------------------- MAPPING ------------------------------------------ ///
    /** @notice mapping for list of stakeholders addresses */
    mapping(address => Stakeholder) public stakeholders;

    /** @notice array for candidates */
    mapping(uint => Candidate) public candidates;

    /** voted for a category */
    mapping(uint256=>mapping(address=>bool)) public votedForCategory;
    
    /** @notice mapping to check votes for a specific category */
    mapping(uint256=>mapping(uint256=>uint256)) public votesForCategory;

    /** @notice mapping to check if a candidate is registered */
    mapping(uint256=>bool) public activeCandidate;
    
    /** @notice mapping for converting category string to uint */
    mapping(string => uint256) public Category;
    
    /** @notice tracks the winner in a catgory */
    mapping(string=>Candidate) private categoryWinner;

    /** @notice tracks the active election */
    mapping(string=>Election) public activeElections;
  

    /// ------------------------------------- MODIFIER ------------------------------------------- ///
    /** @notice modifier to check that only the registered stakeholders can call a function */
    modifier onlyRegisteredStakeholder() {

        /** @notice check that the sender is a registered stakeholder */
        require(stakeholders[msg.sender].isRegistered, 
           "You must be a registered stakeholder");
       _;
    }

    /** @notice modifier to check that only the chairman can call a function */
    modifier onlyChairman() {

        /** @notice check that sender is the chairman */
        require(msg.sender == chairman, 
        "Access granted to only the chairman");
        _;
    }
    
    /** @notice modifier to check that only the chairman or teacher can call a function */
    modifier onlyAccess() {

        /** @notice check that sender is the chairman */
        require(msg.sender == chairman || compareStrings(stakeholders[msg.sender].role,"teacher"), 
        "Access granted to only the chairman or teacher");
        _;
    }
       
    /** @notice modifier to check that function can only be called after the votes have been counted */
    modifier onlyAfterVotesCounted(string memory _category) {

        /** @notice require that this process only occurs after the votes are counted */
        require(activeElections[_category].VotesCounted == true,  
           "Only allowed after votes have been counted");
       _;
    }

    /** @notice modifier to check that contract is not paused */
    modifier onlyWhenNotPaused {
        require(!_paused, "Contract is currently paused");
        _;
    }


    /// ---------------------------------------- EVENTS ----------------------------------------- ///
    /** @notice emit when a stakeholder is registered */
    event StakeholderRegisteredEvent (
            string _role,address[] stakeholderAddress
    ); 

    /** @notice emit when a stakeholder is removed */
    event StakeholderRemovedEvent (
            address stakeholderAddress
    ); 

<<<<<<< HEAD

    /// @notice emit when role is appointed
    event ChangeChairman (address adder, address newChairman);   
=======
    /** @notice emit when role is removed */
    event RemoveRole(address remover, address addr);

    /** @notice emit when role is appointed */
    event AssignedRole (address adder, address newRole);   
>>>>>>> 236355efbb9c113fb4e666e1b9adf220b2047238
     
    /** @notice emit when candidate has been registered */
    event CandidateRegisteredEvent( 
        uint candidateId
    );
    
    /** @notice emit when voting process has started */
    event VotingStartedEvent (string category,bool status);
    
    /** @notice emit when voting process has ended */
    event VotingEndedEvent (string category,bool status);
    
    /** @notice emit when stakeholder has voted */
    event VotedEvent (
        address stakeholder,
        uint candidateId
    );
    
    /** @notice emit when votes have been counted */
    event VotesCountedEvent (string category,uint256 totalVotes);

    
    /// --------------------------------------- FUNCTIONS ------------------------------------------- ///
    /** @dev helper function to compare strings */
    function compareStrings(string memory _str, string memory str) private pure returns (bool) {
        return keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(str));
    }

    /** 
    * @notice check if address is a teacher 
    * @dev funtion cannot be called if contract is paused
    */
    function checkRole(string memory _role,address _address) onlyWhenNotPaused public view 
        returns (bool) {
        return compareStrings( _role,stakeholders[_address].role);
    }     
    
<<<<<<< HEAD
    function changeChairman(address _stakeHolder) onlyChairman onlyWhenNotPaused public{
        require(stakeholders[_stakeHolder].isRegistered ==true,"Can't assign a role of chairman to a non stakeholder.");
        /// @notice change chairman role 
        stakeholders[_stakeHolder].role = "chairman";
        stakeholders[msg.sender].role = "director";
        stakeholders[msg.sender].votingPower= 3;
        stakeholders[msg.sender].votingPower= 4;
        chairman = _stakeHolder;
        /// @notice emit event of new chairman
        emit ChangeChairman(msg.sender, _stakeHolder);
=======
    /**
    * @notice assign roles to stakeholders
    * @dev only chairman can assign roles
    * @dev function cannot be called if contract is paused
    */
    function assignRole(string memory _role,address _stakeHolder) onlyChairman onlyWhenNotPaused public{
        require(stakeholders[_stakeHolder].isRegistered ==true,"Can't assign a role to a non stakeholder.");
        
        /** @notice assign role to stakeholder */
        stakeholders[_stakeHolder].role = _role;
        
        /** @notice emit event of new teacher */
        emit AssignedRole(msg.sender, _stakeHolder);
>>>>>>> 236355efbb9c113fb4e666e1b9adf220b2047238
    }    

    /**
    * @notice upload csv file of stakeholders
    * @dev only chairman and teacher can upload csv file of stakeholders
    * @dev function cannot be called if contract is paused
    */
    function uploadStakeHolder(string memory _role,uint256 _amountOftoken,uint256 votingPower,address[] calldata _address) onlyAccess onlyWhenNotPaused  external {
        
        /// @notice loop through the list of students and upload
        require(
            _address.length >0,
            "Upload array of addresses"
        );
        
        for (uint i = 0; i < _address.length; i++) {
                //mint 5 tokens to students,10 tokens to teachers and 20 to directors
                zstoken.mint(_address[i],_amountOftoken*decimals);
                stakeholders[_address[i]] = Stakeholder(_role, true, false, 0, votingPower );     
        }
        
        /// @notice emit stakeholder registered event
        emit StakeholderRegisteredEvent(_role, _address);
    }
    
    /** 
    * @notice register candidate for election
    * @dev only chairman and teacher can register candidates for election
    * @dev function cannot be called if contract is paused
    */
    function registerCandidate(string memory candidateName, string memory _category) 
        public onlyAccess onlyWhenNotPaused {

        /** @notice check if the position already exists */
        require(Category[_category] != 0,"Category does not exist...");
        
        /** @dev initial state check */
        if(candidatesCount == 0){
            candidatesCount++;
        }
        
        /** @notice add to candidate map by passing in the candidateCount aka id */
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, Category[_category], 0 );
        
        /** @notice check if candidate is active */
        activeCandidate[candidatesCount] = true;
        candidatesCount ++;
        
        /** @notice emit event when candidate is registered */
        emit CandidateRegisteredEvent(candidatesCount);
    }

    /** 
    * @notice add categories of offices for election
    * @dev only chairman and teacher can add categories for election
    * @dev function cannot be called if contract is paused
    */
    function addCategories(string memory _category) onlyAccess onlyWhenNotPaused public returns(string memory ){
        
        /** @notice add to the categories array */
        categories.push(_category);
        
        /** @notice add to the Category map */
        Category[_category] = count;
        count++;
        return _category;
    }

    /** 
    * @notice show all categories of offices available for election
    * @dev function cannot be called if contract is paused
    */
    function showCategories() onlyWhenNotPaused public view returns(string[] memory){
        return categories;
    }

    /** 
    * @notice show all election queue
    * @dev function cannot be called if contract is paused
    */
    function showQueue() onlyWhenNotPaused public view returns(Election[] memory){
        return electionQueue;
    }

    /**
    * @notice setup election
    * @dev takes in category and an array of candidates
    * @dev only chairman and teacher can setup election
    * @dev function cannot be called if contract is paused
    */
    function setUpElection (string memory _category,uint256[] memory _candidateID) public onlyAccess onlyWhenNotPaused returns(bool){
    
        /** @notice create a new election and add to election queue */
        electionQueue.push(Election(
            _category,
            _candidateID,
            false,
            false,
            false,
            false,
            0
        ));
            return true;
        }

    /** 
    * @notice clear election queue 
    * @dev only chairman can clear the election queue
    * @dev function cannot be called if contract is paused    
    */
    function clearElectionQueue() public onlyChairman onlyWhenNotPaused{
        delete electionQueue;
    }
    
    /** 
    * @notice start voting session for a caqtegory
    * @dev only chairman can start voting session
    * @dev function cannot be called if contract is paused    
    */
    function startVotingSession(string memory _category) 
        public onlyChairman onlyWhenNotPaused {
        for(uint256 i = 0;i<electionQueue.length;i++){
            if(compareStrings(electionQueue[i].category,_category)){
                
                /** @notice add election category to active elections */
                activeElections[_category]=electionQueue[i];

                /** @notice start voting session */
                activeElections[_category].VotingStarted=true;
                
                /** @notice update the activeElectionArrays */
                activeElectionArrays.push(electionQueue[i]);
            }
        }

        /** @ notice emit event when voting starts */
        emit VotingStartedEvent(_category,true);
    }
    
    /** 
    * @notice end voting session for a category
    * @dev only chairman can end the voting session
    * @dev function cannot be called if contract is paused
    */
    function endVotingSession(string memory _category) 
        public onlyChairman onlyWhenNotPaused {
        activeElections[_category].VotingEnded = true;
        
        /** @ notice emit event when voting ends */
        emit VotingEndedEvent(_category,true);
    }

    /** 
    * @notice function for voting process
    * @dev only registered stakeholders can vote
    * @dev function cannot be called if contract is paused
    * @return category and candidate voted for
    */
    function vote(string memory _category, uint256 _candidateID) public onlyRegisteredStakeholder onlyWhenNotPaused returns (string memory, uint256) {
        
        /** @notice require that the session for voting is active */
        require(activeElections[_category].VotingStarted ==true,"Voting has not commmenced for this Category");
        
        /** @notice require that the session for voting is not yet ended */
        require(activeElections[_category].VotingEnded ==false,"Voting has not commmenced for this Category");
        
        /** @notice require that a candidate is registered/active */
        require(activeCandidate[_candidateID]==true,"Candidate is not registered for this position.");
    
        /// @notice check that a candidate is valid for a vote in a category
        // require(candidates[_candidateID].category == Category[_category],"Candidate is not Registered for this Office!");
        
        /** @notice check that votes are not duplicated */
        require(votedForCategory[Category[_category]][msg.sender]== false,"Cannot vote twice for a category..");
        stakeholders[msg.sender].hasVoted = true;

        /** @notice check that balance of voter is greater than zero.. 1 token per votes */
        require(zstoken.balanceOf(msg.sender) >1*decimals,"YouR balance is currently not sufficient to vote. Not a stakeholder");
      
        /** @notice ensure that there are no duplicate votes recorded for a candidates category. */
        uint256 votes = votesForCategory[_candidateID][Category[_category]]+=stakeholders[msg.sender].votingPower;
        candidates[_candidateID].voteCount = votes;
        votedForCategory[Category[_category]][msg.sender]=true;
        
        /**
        * @notice emit event when a candidate is voted for
        * @dev emit person that voted and the candidate they voted for
        */
        emit VotedEvent(msg.sender, _candidateID);

        return (_category, _candidateID);
    }

    /** 
    * @notice retrieve winning vote count in a specific category
    * @dev function can only be called after votes have been tallied
    * @dev function cannot be called if contract is paused
    */
    function getWinningCandidate(string memory _category) onlyAfterVotesCounted(_category) onlyWhenNotPaused public view
       returns (Candidate memory,uint256) {
       return (categoryWinner[_category],activeElections[_category].totalVotesCasted);
    }   
    
    /** 
    * @notice fetch a specific election 
    * @dev function cannot be called if contract is paused
    */
    function fetchElection() onlyWhenNotPaused public view returns (Election[] memory) {
        return activeElectionArrays;
    }

    /**
    * @notice compile votes for an election
    * @dev only chairman and teacher can compile votes
    * @dev function cannot be called if contract is paused
    */
    function compileVotes(string memory _position) onlyAccess onlyWhenNotPaused public  returns (uint total, uint winnigVotes, Candidate[] memory){
        
        /** @notice require that the category voting session is over before compiling votes */
        require(activeElections[_position].VotingEnded == true,"This session is still active for voting");
        uint winningVoteCount = 0;
        uint totalVotes=0;
        uint256 winnerId;
        uint winningCandidateIndex = 0;
        Candidate[] memory items = new Candidate[](candidatesCount);
        
        for (uint i = 0; i < candidatesCount; i++) {
            if (candidates[i + 1].category == Category[_position]) {
                totalVotes += candidates[i + 1].voteCount;        
                if ( candidates[i + 1].voteCount > winningVoteCount) {
                    
                    winningVoteCount = candidates[i + 1].voteCount;
                    uint currentId = candidates[i + 1].id;
                    winnerId= currentId;
                    
                    /** @dev winningCandidateIndex = i; */
                    Candidate storage currentItem = candidates[currentId];
                    items[winningCandidateIndex] = currentItem;
                    winningCandidateIndex += 1;
                }
            }
        } 
        
        /** @notice update Election status */
        activeElections[_position].VotesCounted=true;
        
        /** @notice update winner for the category */
        categoryWinner[_position]=candidates[winnerId];
        return (totalVotes, winningVoteCount, items); 
    }
 
    /**
    * @notice setpPaused() is used to pause all functions in the contract in case of an emergency
    * @dev only chairman can pause the contract
    */
    function setPaused(bool _value) public onlyChairman {
        _paused = _value;
    }

    /**
    * @notice only the chairman and teacher can make the election results public
    * @dev function cannot be called if contract is paused
    */
    function makeResultPublic(string memory _category) public onlyAccess onlyWhenNotPaused returns(Candidate memory,string memory) {

        /** @notice require that the category voting session is over before compiling votes */
        require(activeElections[_category].VotesCounted == true, "This session is still active, voting has not yet been counted");
        activeElections[_category].isResultPublic = true;
        return (categoryWinner[_category],_category);
        } 
    }
