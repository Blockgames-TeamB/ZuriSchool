//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;
import "./ZuriSchoolToken.sol";


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
contract ZuriSchool {

    constructor(address _tokenAddr) {
        zstoken = ZuriSchoolToken(_tokenAddr);
        zstoken.mint(msg.sender, 10000 * 10**18);
        /// @notice add chairman is the deployer of the contract
        chairman = msg.sender;
    }

    /// --------------------------- STRUCT ------------------------------------ ///
    /// @notice structure for stakeholders
    struct Stakeholder {
        bool isRegistered;
        bool hasVoted;  
        uint votedCandidateId;   
    }

    /// @notice structure for candidates
    struct Candidate {
        uint256   id;
        string name;   
        uint256 category;
        uint voteCount; 
    }
    
    /// @notice structure for election
    struct Election {
        string category;
        uint256[] candidatesID;
        bool VotingStarted;
        bool VotingEnded;
        bool VotesCounted;
        bool isResultPublic;
    }

    /// -------------------------- VARIABLES ----------------------------------- ///
    /// @notice state variable for tokens
    ZuriSchoolToken public zstoken;

    /// @notice declare state variable teacher
    address[] public teachers;

    /// @notice declare state variable chairman
    address public chairman;

    /// @notice declare state variable director
    address[] public directors;
    
    /// @notice declare array of state variable student
    address[] public students;

    /// @notice declare state variable candidatesCount
    uint public candidatesCount = 0;

    /// @notice id of winner
    uint private winningCandidateId;

    /// @notice array of stakeholders
    address[] public registeredStakeholders;

    /// @notice array for categories
    string[] public categories;

    /// @notice CategoryTrack
    uint256 count = 1;

    /// @notice declare state variable _paused
    bool public _paused;

    /// @notice election queue
    Election[] public electionQueue;

    /// @notice election array
    Election[] public activeElectionArrays;


    /// ---------------------- MAPPING ------------------------------------ ///
    /// @notice mapping for list of stakeholders addresses
    mapping(address => Stakeholder) public stakeholders;

    /// @notice mapping for list of stakeholders current status
    // mapping(address => bool) public isStakeholders;

    /// @notice mapping for list of directors
    mapping(address => bool) public director;

    /// @notice mapping for list of teachers
    mapping(address => bool) public teacher;
    
     /// @notice mapping for list of student
    mapping(address => bool) public student;

    /// @notice array for candidates
    mapping(uint => Candidate) public candidates;

    //voted for a category
    mapping(uint256=>mapping(address=>bool)) public votedForCategory;
    
    /// @notice mapping to check votes for a specific category
    mapping(uint256=>mapping(uint256=>uint256)) public votesForCategory;

    /// @notice mapping to check if a candidate is registered
    mapping(uint256=>bool) public activeCandidate;
    
    /// @notice mapping for converting category string to uint
    mapping(string => uint256) public Category;
    
    /// @notice tracks the winner in a catgory
    mapping(string=>Candidate) private categoryWinner;

    /// @notice tracks the active election
    mapping(string=>Election) public activeElections;
  

    /// ----------------------- MODIFIER -------------------------------------- ///
    /// @notice modifier to check that only the registered stakeholders can call a function
    modifier onlyRegisteredStakeholder() {

        /// @notice check that the sender is a registered stakeholder
        require(stakeholders[msg.sender].isRegistered, 
           "You must be a registered stakeholder");
       _;
    }

    /// @notice modifier to check that only the chairman can call a function
    modifier onlyChairman() {

        /// @notice check that sender is the chairman
        require(msg.sender == chairman, 
        "Access granted to only the chairman");
        _;
    }
    
    /// @notice modifier to check that only the chairman or teacher can call a function
    modifier onlyAccess() {

        /// @notice check that sender is the chairman
        require(msg.sender == chairman || teacher[msg.sender] == true, 
        "Access granted to only the chairman or teacher");
        _;
    }

    /// @notice modifier to check that only the chairman, teacher or director can call a function
    modifier onlyGranted() {

        /// @notice check that sender is the chairman
        require ((msg.sender == chairman) || (teacher[msg.sender]==true) || (director[msg.sender] ==true), 
        "Access granted to only the chairman, teacher or director");
        _;
    }
    
    /// @notice modifier to check that function can only be called when voting has started
    modifier onlyDuringVotingSession(string memory _category) {

        /// @notice require that this process only occurs during the voting period
        require(activeElections[_category].VotingStarted ==true, 
           "You can only do this during the voting session");
       _;
    }
    
    /// @notice modifier to check that function can only be called after the votes have been counted
    modifier onlyAfterVotesCounted(string memory _category) {

        /// @notice require that this process only occurs after the votes are counted
        require(activeElections[_category].VotesCounted == true,  
           "Only allowed after votes have been counted");
       _;
    }

    /// @notice modifier to check that contract is not paused
    modifier onlyWhenNotPaused {
        require(!_paused, "Contract is currently paused");
        _;
    }


    /// ---------------------------- EVENTS ----------------------------------------- ///
    /// @notice emit when a stakeholder is registered
    event StakeholderRegisteredEvent (
            string _role,address[] stakeholderAddress
    ); 

    /// @notice emit when a stakeholder is removed
    event StakeholderRemovedEvent (
            address stakeholderAddress
    ); 

    /// @notice emit when role is removed
    event RemoveRole(address remover, address addr);

    /// @notice emit when role is appointed
    event AssignedRole (address adder, address newRole);   
     
    /// @notice emit when candidate has been registered
    event CandidateRegisteredEvent( 
        uint candidateId
    );
    
    /// @notice emit when voting process status changes
    event VotingProcessChangeEvent (
       bool previousVotingStatus,bool currentVotingStatus
    );

    /// @notice emit when voting process has started
    event VotingStartedEvent (string category,bool status);
    
    /// @notice emit when voting process has ended
    event VotingEndedEvent (string category,bool status);
    
    /// @notice emit when stakeholder has voted
    event VotedEvent (
        address stakeholder,
        uint candidateId
    );
    
    /// @notice emit when votes have been counted
    event VotesCountedEvent (string category,uint256 totalVotes);

    
    /// ------------------------------------------ FUNCTIONS ------------------------------------------------- ///
    /// @dev helper function to compare strings
    function compareStrings(string memory _str, string memory str) private pure returns (bool) {
        return keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(str));
    }

    /// @notice check stakeholder role
    function checkRole(string memory _role,address _address) onlyWhenNotPaused public view 
        returns (bool) {
        bool result;
        if(compareStrings(_role,"teacher")){
            result = teacher[_address];
        }else if(compareStrings(_role,"director")){
            result = director[_address];
        }else if(compareStrings(_role,"chairman")){
            result =( _address == chairman);
        }else if(compareStrings(_role,"student")) {
            result = true;
        }    
        return  result;
    }     
    
    /// @notice function to assign role to stakeholder
    function assignRole(string memory _role,address _stakeHolder) onlyChairman public{
        require(stakeholders[_stakeHolder].isRegistered ==true,"Can't assign a role to a non stakeholder.");
        if(compareStrings(_role,"teacher")){
            teacher[_stakeHolder] = true;
        }else if(compareStrings(_role,"director")){
            director[_stakeHolder] = true;
        }
        /// @notice emit event of new teacher
        emit AssignedRole(msg.sender, _stakeHolder);
    }    

    /// @notice function to remove role from stakeholder
    function removeRole(string memory _role ,address _addr) public onlyChairman{
        if(compareStrings(_role,"teacher")){
            teacher[_addr] = false;
        }else if(compareStrings(_role,"director")){
            director[_addr] = false;
        }else if(compareStrings(_role,"stakeholder")){
            stakeholders[_addr].isRegistered  = false;
        }
        /// @notice emit event of new teacher
        emit RemoveRole(msg.sender,_addr);
    }

    /// @notice function to register stakeholder
    function uploadStakeHolder(string memory _role,address[] calldata _address) onlyAccess onlyWhenNotPaused  external {
        
        /// @notice loop through the list of students and upload
        require(
            _address.length >0,
            "Upload array of addresses"
        );
        
        for (uint i = 0; i < _address.length; i++) {
            
            /// @notice check if stakeholder is a student
            if(compareStrings(_role,"student")){
                /// @notice avoid duplication
                 if(student[_address[i]] !=true){ 
                        /// @notice mint 5 tokens to students
                        zstoken.mint(_address[i],5);
                        students.push(_address[i]);
                        student[_address[i]] =true;
                        stakeholders[_address[i]] = Stakeholder(true, false, 0 );
                    }

            /// @notice check if stakeholder is a teacher
            } else if(compareStrings(_role,"teacher")) {
                /// @notice avoid duplication
                if(teacher[_address[i]] != true){
                    /// @notice mint 10 tokens to teachers
                    zstoken.mint(_address[i],10);
                    teacher[_address[i]] = true;
                    stakeholders[_address[i]] = Stakeholder(true, false, 0 );
                    teachers.push(_address[i]);
                }

            /// @notice check if stakeholder is a director
            }else if(compareStrings(_role,"director")) {
                 /// @notice avoid duplication
                if(director[_address[i]] != true){
                    /// @notice mint 20 tokens to directors
                    zstoken.mint(_address[i],20);
                    director[_address[i]] = true;
                    stakeholders[_address[i]] = Stakeholder(true, false, 0 );
                }
            }
        }
        
        /// @notice emit stakeholder registered event
        emit StakeholderRegisteredEvent(_role,_address);
    }
    
    /// @notice store candidates information
    function registerCandidate(string memory candidateName, string memory _category) 
        public onlyAccess onlyWhenNotPaused {

        /// @notice check that candidate not already active for an election
        require(activeCandidate[candidatesCount]==false,"Candidate is already active for an election");
        
        /// @notice check if the position already exists
        require(Category[_category] != 0,"Category does not exist...");
        
        /// @dev initial state check
        if(candidatesCount == 0){
            candidatesCount++;
        }
        
        /// @notice add to candidate map by passing in the candidateCount aka id
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, Category[_category], 0 );
        
        /// @notice check if candidate is active
        activeCandidate[candidatesCount] = true;
        candidatesCount ++;
        
        /// @notice emit event when candidate is registered
        emit CandidateRegisteredEvent(candidatesCount);
    }

    ///@notice add categories of offices for election
    function addCategories(string memory _category) onlyAccess onlyWhenNotPaused public returns(string memory ){
        
        /// @notice add to the categories array
        categories.push(_category);
        
        /// @notice add to the Category map
        Category[_category] = count;
        count++;
        return _category;
    }

    ///@notice show all categories of offices available for election
    function showCategories() onlyWhenNotPaused public view returns(string[] memory){
        return categories;
    }

    /// @notice setup election
    /// @dev takes in category and an array of candidates
    function setUpElection (string memory _category,uint256[] memory _candidateID) public onlyAccess onlyWhenNotPaused returns(bool){
    
    /// @notice create a new election and add to election queue
    electionQueue.push(Election(
        _category,
        _candidateID,
        false,
        false,
        false,
        false
    ));
        return true;
    }

    /// @notice clear election queue
    function clearElectionQueue() public onlyChairman onlyWhenNotPaused{
        delete electionQueue;
    }
    
    /// @notice start voting session for a caqtegory
    function startVotingSession(string memory _category) 
        public onlyChairman onlyWhenNotPaused {
        for(uint256 i = 0;i<electionQueue.length;i++){
            if(compareStrings(electionQueue[i].category,_category)){
                //add election category to active elections
                activeElections[_category]=electionQueue[i];
                //start voting session
                activeElections[_category].VotingStarted=true;
                //update the activeElectionArrays
                activeElectionArrays.push(electionQueue[i]);
            }
        }
        emit VotingStartedEvent(_category,true);
    }
    
    /// @notice end voting session for a category
    function endVotingSession(string memory _category) 
        public onlyChairman onlyWhenNotPaused {
        activeElections[_category].VotingEnded = true;
        
        emit VotingEndedEvent(_category,true);
        emit VotingProcessChangeEvent(
            activeElections[_category].VotingStarted, activeElections[_category].VotingEnded);        
    }
     
    /// @notice function for voting process
    /// @return category and candidate voted for
    function vote(string memory _category, uint256 _candidateID) public onlyRegisteredStakeholder onlyDuringVotingSession(_category) onlyWhenNotPaused returns (string memory, uint256) {
        
        /// @notice require that the session for voting is active
        require(activeElections[_category].VotingStarted ==true,"Voting has not commmenced for this Category");
        
        /// @notice require that the session for voting is not yet ended
        require(activeElections[_category].VotingEnded ==false,"Voting has not commmenced for this Category");
        
        /// @notice require that a candidate is registered/active
        require(activeCandidate[_candidateID]==true,"Candidate is not registered for this position.");
    
        /// @notice check that a candidate is valid for a vote in a category
        require(candidates[_candidateID].category == Category[_category],"Candidate is not Registered for this Office!");
        
        /// @notice check that votes are not duplicated
        require(votedForCategory[Category[_category]][msg.sender]== false,"Cannot vote twice for a category..");
        stakeholders[msg.sender].hasVoted = true;

        //require that balance of voter is greater than zero.. 1 token per votes
        require(zstoken.balanceOf(msg.sender) >0,"YouR balance is currently not sufficient to vote. Not a stakeholder");
        uint256 votingPower=0;
        //set voting power
        if(teacher[msg.sender]== true){
            votingPower = 2;
        }else if(director[msg.sender]== true){
            votingPower = 3;
        }
        else if(msg.sender== chairman){
            votingPower = 4;
        }else if(student[msg.sender]== true){
            votingPower = 1;
        }
        
        /// @notice ensuring there are no duplicate votes recorded for a candidates category.
        uint256 votes = votesForCategory[_candidateID][Category[_category]]+=votingPower;
        candidates[_candidateID].voteCount = votes;
        votedForCategory[Category[_category]][msg.sender]=true;
        
        emit VotedEvent(msg.sender, _candidateID);
    
        return (_category, _candidateID);
    }

    /// @notice retrieve winning vote count in a specific category
    function getWinningCandidate(string memory _category) onlyAfterVotesCounted(_category) onlyWhenNotPaused public view
       returns (Candidate memory) {
       return categoryWinner[_category];
    }   
    
    /// @notice fetch a specific election
    function fetchElection() onlyWhenNotPaused public view returns (Election[] memory) {
        return activeElectionArrays;
    }

    /// @notice compile votes for an election
    function compileVotes(string memory _position) onlyAccess onlyWhenNotPaused public  returns (uint total, uint winnigVotes, Candidate[] memory){
        
        /// @notice require that the category voting session is over before compiling votes
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
                    
                    /// @dev winningCandidateIndex = i;
                    Candidate storage currentItem = candidates[currentId];
                    items[winningCandidateIndex] = currentItem;
                    winningCandidateIndex += 1;
                }
            }

        } 

        /// @notice update Election status
        activeElections[_position].VotesCounted=true;
        
        /// @notice update winner for the category
        categoryWinner[_position]=candidates[winnerId];
        return (totalVotes, winningVoteCount, items); 
    }
 
    /// @notice setpPaused() is used to pause all functions in the contract in case of an emergency
    function setPaused(bool _value) public onlyChairman {
        _paused = _value;
    }

    /// @notice ensure that only the chairman, teacher or director can make the election results public
    function makeResultPublic(string memory _category) public onlyGranted returns(Candidate memory,string memory) {

        /// @notice require that the category voting session is over before compiling votes
        require(activeElections[_category].VotesCounted=true,"This session is still active,voting has not yet been counted");
        activeElections[_category].isResultPublic=true;
        return (categoryWinner[_category],_category);
        } 
    }
    