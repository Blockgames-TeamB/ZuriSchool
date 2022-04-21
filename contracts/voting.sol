//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;


///TODO///
// function to add and remove stakeholder - completed, remains integration with UI
// function to remove teacher - completed, remains integration with UI
// function to remove director - completed, remains integration with UI
// upload of csv and conversion to array
// pause & unpause contract
// function to remove director - duplicate! was it meant for a different task?



///@dev test process
///-1- add category
///-2-  register candidates
///-3- setup election
///-4-start voting session
///-5- vote 
///-6- end voting session
///-7- compile votes

/// @author TeamB - Blockgames Internship 22
/// @title A Voting Dapp
contract ZuriSchool {
    
    // STRUCT
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
    // mapping(uint256 => Candidate) public candidate;
    struct Election {
        string category;
        uint256[] candidatesID;
        bool VotingStarted;
        bool VotingEnded;
        bool VotesCounted;
    }

    /// @notice declare state variable teacher
    address public teacher;

    /// @notice declare state variable chairman
    address public chairman;

    /// @notice declare state variable director
    address public director;

    /// @notice mapping for list of stakeholders
    mapping(address => Stakeholder) public stakeholders;

    /// @notice mapping for list of directors
    mapping(address => bool) public directors;

    /// @notice declare state variable candidatesCount
    uint public candidatesCount=0;

    /// @notice mapping for list of teachers
    mapping(address => bool) public teachers;

    /// @notice array for candidates
    mapping(uint => Candidate) public candidates;

    /// @dev id of winner
    // uint private winningCandidateId;
    address[] public registeredStakeholders;
    //voted for a category
    mapping(uint256=>mapping(address=>bool)) public votedForCategory;
    mapping(uint256=>mapping(uint256=>uint256)) public votesForCategory;

    mapping(uint256=>bool) public activeCandidate;
    mapping(string => uint256) public Category;
    string[] public categories;
    uint256 count=1 ;

    mapping(uint256=>bool) public categoryRegistrationStatus;//tracks the catgory if registration is in session or not
    mapping(string=>Candidate) public categoryWinner;
    mapping(string=>Election) public activeElections;
    /// election queue
    Election[] public electionQueue;

    // MODIFIER
    /// @notice modifier to check that only teachers can call a function
    modifier onlyTeacher() {

        /// @notice check that sender is a teacher
        require(msg.sender == teacher, 
        "You're not one of our teachers");
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
        require(msg.sender == chairman || msg.sender == teacher, 
        "Access granted to only the chairman");
        _;
    }

    /// @notice modifier to check that only the registered stakeholders can call a function
    modifier onlyRegisteredStakeholder() {

        /// @notice check that the sender is a registered stakeholder
        require(stakeholders[msg.sender].isRegistered, 
           "You must be a registered stakeholder");
       _;
    }
    
    /// @notice modifier to check that function can only be called during the voting period
    modifier onlyDuringVotingSession(string memory _category) {

        /// @notice require that this process only occurs during the voting period
        require(activeElections[_category].VotingStarted ==true, 
           "You can only do this during the voting session");
       _;
    }
    
    /// @notice modifier to check that function can only be called after the voting period
    modifier onlyAfterVotingSession(string memory _category) {

        /// @notice require that this process only occurs after the voting period
        require(activeElections[_category].VotingEnded == true,  
           "You can only do this after the voting has ended");
       _;
    }
    
    /// @notice modifier to check that function can only be called after the votes have been counted
    modifier onlyAfterVotesCounted(string memory _category) {

        /// @notice require that this process only occurs after the votes are counted
        require(activeElections[_category].VotesCounted == true,  
           "Only allowed after votes have been counted");
       _;
    }
    
    //modifier to ensure only directors can call selected functions.
    modifier isDirector(address _user) {
        bool isdirector = directors[_user];
        require(isdirector, "Only Directors have Access!");
        _;
    }

    // EVENTS
    /// @notice emit when a stakeholder is registered
    event StakeholderRegisteredEvent (
            address stakeholderAddress
    ); 

    /// @notice emit when a stakeholder is removed
    event StakeholderRemovedEvent (
            address stakeholderAddress
    ); 

    /// @notice emit when candidate registration has started
    event CandidatesRegistrationStartedEvent ();
    
    /// @notice emit when candidate registration has ended
    event CandidatesRegistrationEndedEvent ();
     
    /// @notice emit when candidate registers successfully
    event CandidateRegisteredEvent( 
        uint candidateId
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
    
    /// @notice emit when voting process status changes
    event VotingProcessChangeEvent (
       bool previousVotingStatus,bool currentVotingStatus
    );

    /// @notice emit when director is appointed
    event AppointDirector (address adder, address newDirector);

    /// @notice emit when director is removed
    event RemoveDirector(address remover, address oldDirector);

    /// @notice emit when teacher is appointed
    event AppointTeacher (address adder, address newTeacher);

    /// @notice emit when a teacher is removed
    event RemoveTeacher(address remover, address oldTeacher);    
    
    constructor() {
        chairman = msg.sender;
    }
     //helper function compare strings
    function compareStrings(string memory _str, string memory str) private pure returns (bool) {
        return keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(str));
    }
    
    
    
    /// @notice store candidates information
    function registerCandidate(string memory candidateName, string memory _category) 
        public onlyAccess {
        //require that candidate not active for an election
        require(activeCandidate[candidatesCount]==false,"Candidate is already active for an election");
        //check if the position exist
        require(Category[_category] != 0,"Category does not exist...");
        //initial state check
        if(candidatesCount ==0){
            candidatesCount++;
        }
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, Category[_category], 0 );
        //activate candidate
        activeCandidate[candidatesCount]=true;
        candidatesCount++;
        emit CandidateRegisteredEvent(candidatesCount);
    }
    ///@notice add categories of offices for election
    function addCategories(string memory _category) public returns(string memory ){
        //add to the categories array
        categories.push(_category);
        //add to the Category map
        Category[_category]=count;
        count++;
        return _category;
    }

    ///@notice show all categories of offices available for election
    function showCategories() public view returns(string[] memory){
        return categories;
    }
  
    ///setup election 
    function setUpElection (string memory _category,uint256[] memory _candidateID) public returns(bool){
    //create a new election and add to election queue
    electionQueue.push(Election(
        _category,
        _candidateID,
        false,
        false,
        false
    ));
    return true;
    }

    ///clear election queue
    function clearElectionQueue() public onlyChairman{
        delete electionQueue;
    }
    /// @notice start voting session
    function startVotingSession(string memory _category) 
        public onlyAccess {
        for(uint256 i = 0;i<electionQueue.length;i++){
            if(compareStrings(electionQueue[i].category,_category)){
                //add election category to active elections
                activeElections[_category]=electionQueue[i];
                //start voting session
                activeElections[_category].VotingStarted=true;
            }
        }
        emit VotingStartedEvent(_category,true);
    }
    
    /// @notice end voting session
    function endVotingSession(string memory _category) 
        public onlyAccess {
        activeElections[_category].VotingEnded = true;
        emit VotingEndedEvent(_category,true);
        emit VotingProcessChangeEvent( 
            activeElections[_category].VotingStarted, activeElections[_category].VotingEnded);        
    }
    
     function vote(string memory _category, uint256 _candidateID) public onlyRegisteredStakeholder onlyDuringVotingSession(_category) returns (string memory, uint256) {
        //require that the session for voting is active
        require(activeElections[_category].VotingStarted ==true,"Voting has not commmenced for this Category");
        //require that the session for voting is not yet ended
        require(activeElections[_category].VotingEnded ==false,"Voting has not commmenced for this Category");
        //require that a candidate is registered/active
        require(activeCandidate[_candidateID]==true,"Candidate is not registered for this position.");
        //require that a candidate is valid for a vote in a category
        require(candidates[_candidateID].category == Category[_category],"Candidate is not Registered for this Office!");
        require(votedForCategory[Category[_category]][msg.sender]== false,"Cannot vote twice for a category..");
        stakeholders[msg.sender].hasVoted = true;
        //ensuring there are no duplicate votes recorded for a candidates category.
        uint256 votes = votesForCategory[_candidateID][Category[_category]]+=1;
        candidates[_candidateID].voteCount = votes;
        votedForCategory[Category[_category]][msg.sender]=true;
        emit VotedEvent(msg.sender, _candidateID);
        return (_category, _candidateID);
    }
    function getWinningCandidateId(string memory _category) onlyAfterVotesCounted(_category) public view
       returns (uint) {
       return categoryWinner[_category].id;
    }
    
    function getWinningCandidateName(string memory _category) 
       onlyAfterVotesCounted(_category) public view
       returns (string memory,Candidate memory) {
       return (categoryWinner[_category].name,categoryWinner[_category]);
    }  
    
    function getWinningCandidateVoteCounts(string memory _category) onlyAfterVotesCounted(_category) public view
       returns (uint) {
       return categoryWinner[_category].voteCount;
    }   
    
    function isRegisteredStakeholder(address _stakeholderAddress) public view
       returns (bool) {
       return stakeholders[_stakeholderAddress].isRegistered;
    }
     
    function isTeacher(address _address) public view 
        returns (bool) {
        return _address == teacher;
    }     
     
    function isChairman(address _address) public view 
        returns (bool) {
        return _address == chairman;
    }     

    
    function registerStakeholder(address _stakeholderAddress) 
        public onlyAccess {
        
        require(!stakeholders[_stakeholderAddress].isRegistered, 
           "the stakeholder is already registered"); 
        
        stakeholders[_stakeholderAddress].isRegistered = true;
        stakeholders[_stakeholderAddress].hasVoted = false;
        stakeholders[_stakeholderAddress].votedCandidateId = 0;
        
        emit StakeholderRegisteredEvent(_stakeholderAddress);
    }

    function removeStakeholder(address _stakeholderAddress) public onlyAccess {
        delete stakeholders[_stakeholderAddress];
        emit StakeholderRemovedEvent(_stakeholderAddress);
    }

    /// @notice add a director
    function assignDirector(address _newDirector) 
        public onlyChairman {
        directors[_newDirector] = true;
        
        /// @notice emit event of new director
        emit AppointDirector(msg.sender, _newDirector);
    }

    function removeDirector(address _oldDirector) public onlyChairman {
        delete directors[_oldDirector];
        emit RemoveDirector(msg.sender, _oldDirector);
    }


    /// @notice add a teacher
    function assignTeacher(address _newTeacher) 
        public onlyChairman {
        teachers[_newTeacher] = true;
        
        /// @notice emit event of new teacher
        emit AppointTeacher(msg.sender, _newTeacher);
    }

    function removeTeacher(address _oldTeacher) public onlyChairman {
        delete teachers[_oldTeacher];
        emit RemoveTeacher(msg.sender, _oldTeacher);
    }

    function fetchElection() public view returns (Candidate[] memory) {
    
        uint currentIndex = 0;

        Candidate[] memory items = new Candidate[](candidatesCount);
            for (uint i = 0; i < candidatesCount; i++) {
                
                    uint currentId = candidates[i + 1].id;
                    Candidate storage currentItem = candidates[currentId];
                    items[currentIndex] = currentItem;
                    currentIndex += 1;
            }
                return items;
    }

    function compileVotes(string memory _position) onlyAccess public  returns (uint total, uint winnigVotes, Candidate[] memory){
        //require that the category voting session is over before compiling votes
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
                    winnerId= candidates[i + 1].id;
                    // winningCandidateIndex = i;
                    Candidate storage currentItem = candidates[currentId];
                    items[winningCandidateIndex] = currentItem;
                    winningCandidateIndex += 1;
                }
            }

        } 
        //update Election status
        activeElections[_position].VotesCounted=true;
        //update winner for the category
        categoryWinner[_position]=candidates[winnerId];
        return (totalVotes, winningVoteCount, items); 
    }
        
}
