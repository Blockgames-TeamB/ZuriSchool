//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;


///TODO///
// upload of csv and conversion to array
// pause & unpause contract


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
    
    struct Election {
        string category;
        uint256[] candidatesID;
        VotingProcess votingProcess;
    }


    // ENUM
    /// @notice voting process
    enum VotingProcess {
        RegisteredStakeholders, 
        CandidatesRegistrationStarted,
        CandidatesRegistrationEnded,
        VotingStarted,
        VotingEnded,
        VotesCounted
    }


    // STATE VARIABLES
    /// @notice declare state variable votingprocess
    VotingProcess public votingProcess;

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

    /// @notice votecount
    uint256 count = 1;

    /// @notice _disabled is used to disable the voting process
    bool public _disabled;

    /// @notice _paused is used to pause all functions in the smart contract in case of emergency
    bool public _paused;

    /// election queue
    Election[] public electionQueue;


    // MAPPING
    /// @notice mapping for list of stakeholders
    mapping(address => Stakeholder) public stakeholders;

    /// @notice mapping for list of stakeholders current status
    mapping(address => bool) public isStakeholders;

    /// @notice mapping for list of directors
    mapping(address => bool) public director;

    /// @notice mapping for list of teachers
    mapping(address => bool) public teacher;
    
     /// @notice mapping for list of student
    mapping(address => bool) public student;

    /// @notice array for candidates
    mapping(uint => Candidate) public candidates;

    /// @notice mapping to check if an address has voted for a category
    mapping(uint256=>mapping(address=>bool)) public votedForCategory;
    
    /// @notice mapping to check votes for a specific category
    mapping(uint256=>mapping(uint256=>uint256)) public votesForCategory;

    /// @notice mapping to check if a candidate is registered
    mapping(uint256=>bool) public activeCandidate;
    
    /// @notice mapping for converting category string to uint
    mapping(string => uint256) public Category;
    

    // MODIFIER    
    /// @notice modifier to check that only the chairman can call a function
    modifier onlyChairman() {

        /// @notice check that sender is the chairman
        require(msg.sender == chairman, 
        "Access granted to only the chairman");
        _;
    }
    
     /// @notice modifier to check that only the teachers can call a function
    
    modifier onlyTeachers() {

        /// @notice check that sender is a teacher
        
        require( teacher[msg.sender] ==true, 
        "Access granted to only the teachers");
        _;
    }
    /// @notice modifier to check that only the chairman or teacher can call a function
    modifier onlyAccess() {

        /// @notice check that sender is the chairman
        require(msg.sender == chairman || teacher[msg.sender] ==true, 
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
    
    //modifier to ensure only directors can call selected functions.
    modifier isDirector(address _user) {
        bool isdirector = director[_user];
        require(isdirector, "Only Directors have Access!");
        _;
    }

 /// @notice modifier to check that voting is not disabled
    modifier onlyWhenNotDisabled {
        require(!_disabled, "Voting currently disabled");
        _;
    }

 /// @notice modifier to check that contract is not paused
    modifier onlyWhenNotPaused {
        require(!_paused, "Contract is currently paused");
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
    event VotingStartedEvent ();
    
    /// @notice emit when voting process has ended
    event VotingEndedEvent ();
    
    /// @notice emit when stakeholder has voted
    event VotedEvent (
        address stakeholder,
        uint candidateId
    );
    
    /// @notice emit when votes have been counted
    event VotesCountedEvent ();
    
    /// @notice emit when voting process status changes
    event VotingProcessChangeEvent (
       VotingProcess previousStatus,
       VotingProcess newStatus
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
        votingProcess = VotingProcess.RegisteredStakeholders;
    }  
    
    /// @notice store candidates information
    function registerCandidate(string memory candidateName, string memory _category) 
        public onlyAccess onlyWhenNotPaused {

        /// @notice check that candidate not already active for an election
        require(activeCandidate[candidatesCount]==false,"Candidate is already active for an election");
        
        /// @notice check if the position exist
        require(Category[_category] != 0,"Category does not exist...");
        
        /// @dev initial state check
        if(candidatesCount == 0){
            candidatesCount++;
        }
        
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, Category[_category], 0 );
        
        /// @notice activate candidate
        activeCandidate[candidatesCount] = true;
        candidatesCount ++;
        
        emit CandidateRegisteredEvent(candidatesCount);
    }

    ///@notice add categories of offices for election
    function addCategories(string memory _category) onlyWhenNotPaused public returns(string memory ){
        
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
    function setUpElection (string memory _category,uint256[] memory _candidateID) public onlyWhenNotPaused returns(bool){
    
    /// @notice create a new election and add to election queue
    electionQueue.push(Election(
        _category,
        _candidateID,
        votingProcess
    ));
    return true;
    }

    /// @notice start voting session
    function startVotingSession() 
        public onlyAccess onlyWhenNotPaused {
        votingProcess = VotingProcess.VotingStarted;
        
        /// @dev emit events
        emit VotingStartedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.CandidatesRegistrationEnded, votingProcess);
    }
    
    /// @notice end voting session
    function endVotingSession() 
        public onlyAccess onlyWhenNotPaused {
        votingProcess = VotingProcess.VotingEnded;
        
        emit VotingEndedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.VotingStarted, votingProcess);        
    }
    
    /// @notice function for voting process
    /// @return category and candidate voted for
    function vote(string memory _category, uint256 _candidateID) public onlyWhenNotDisabled onlyWhenNotPaused returns (string memory, uint256) {
    
        /// @notice require that a candidate is registered/active
        require(activeCandidate[_candidateID]==true,"Candidate is not registered for this position.");
    
        /// @notice check that a candidate is valid for a vote in a category
        require(candidates[_candidateID].category == Category[_category],"Candidate is not Registered for this Office!");
        
        /// @notice check that votes are not duplicated
        require(votedForCategory[Category[_category]][msg.sender]== false,"Cannot vote twice for a category..");
        stakeholders[msg.sender].hasVoted = true;
    
        /// @notice ensuring there are no duplicate votes recorded for a candidates category.
        uint256 votes = votesForCategory[_candidateID][Category[_category]]+=1;
        candidates[_candidateID].voteCount = votes;
        votedForCategory[Category[_category]][msg.sender]=true;
    
        emit VotedEvent(msg.sender, _candidateID);
    
        return (_category, _candidateID);
    }
    
    /// @notice check if address is a registered stakeholder
    function isRegisteredStakeholder(address _stakeholderAddress) onlyWhenNotPaused public view
       returns (bool) {
       return stakeholders[_stakeholderAddress].isRegistered;
    }
    
    /// @notice check if address is a teacher
    function isTeacher(address _address) onlyWhenNotPaused public view 
        returns (bool) {
         bool result = teacher[_address];
        return  result;
    }     
    
    /// @notice check if address is the chairman
    function isChairman(address _address) public onlyWhenNotPaused view 
        returns (bool) {
        return _address == chairman;
    }     
    
    /// @notice stakeholder registration
    function registerStakeholder(address _stakeholderAddress) 
        public onlyAccess onlyWhenNotPaused {
        
        require(!stakeholders[_stakeholderAddress].isRegistered, 
           "the stakeholder is already registered"); 
        
        stakeholders[_stakeholderAddress].isRegistered = true;
        stakeholders[_stakeholderAddress].hasVoted = false;
        stakeholders[_stakeholderAddress].votedCandidateId = 0;
        
        /// @notice emit stakeholder registered event
        emit StakeholderRegisteredEvent(_stakeholderAddress);
    }

    /// @notice remove stakeholder
    function removeStakeholder(address _stakeholderAddress) public onlyAccess onlyWhenNotPaused{
        isStakeholders[_stakeholderAddress] = false;
        emit StakeholderRemovedEvent(_stakeholderAddress);
    }

    /// @notice add a director
    function assignDirector(address _newDirector) 
        public onlyChairman onlyWhenNotPaused{
        director[_newDirector] = true;
        
        /// @notice emit event of new director
        emit AppointDirector(msg.sender, _newDirector);
    }

    /// @notice remove a director
    function removeDirector(address _oldDirector) public onlyChairman onlyWhenNotPaused {
        director[_oldDirector] = false;

        /// @notice emit event when a director is removed
        emit RemoveDirector(msg.sender, _oldDirector);
    }

    /// @notice add a teacher
    function assignTeacher(address _newTeacher) 
        public onlyChairman onlyWhenNotPaused {
        teacher[_newTeacher] = true;
        
        /// @notice emit event of new teacher
        emit AppointTeacher(msg.sender, _newTeacher);
    }

    /// @notice remove a teacher
    function removeTeacher(address _oldTeacher) public onlyChairman onlyWhenNotPaused {
        teacher[_oldTeacher] = false;

        /// @notice emit event when a teacher is removed
        emit RemoveTeacher(msg.sender, _oldTeacher);
    }

 function uploadTeachers(address[] calldata _address) onlyChairman onlyWhenNotPaused
        external
    
    {
        //loop through the loyal customers and map rewards from the allocatedQuotas
        require(
            _address.length >0,
            "Upload array of addresses"
        );

        for (uint i = 0; i < _address.length; i++) {
            ///avoid duplication
            if(teacher[_address[i]] != true)
            {teacher[_address[i]] = true;
       
             stakeholders[_address[i]] = Stakeholder(true, false, 0 );
             teachers.push(_address[i]);
             }
        }
        
       
       
    }

function uploadDirectors(address[] calldata _address) onlyChairman onlyWhenNotPaused
        external
    
    {
        //loop through the loyal customers and map rewards from the allocatedQuotas
        require(
            _address.length >0,
            "Upload array of addresses"
        );

        for (uint i = 0; i < _address.length; i++) {
            //avoid duplication
            if(director[_address[i]] != true)
            {director[_address[i]] = true;
       
             stakeholders[_address[i]] = Stakeholder(true, false, 0 );
             }
        }
        
       
       
    }

function uploadStudents(address[] calldata _address) onlyTeachers onlyWhenNotPaused
        external
    
    {
        //loop through the loyal customers and map rewards from the allocatedQuotas
        require(
            _address.length >0,
            "Upload array of addresses"
        );

        for (uint i = 0; i < _address.length; i++) {
            //avoid duplication
            if(student[_address[i]] !=true)
          { 
              students.push(_address[i]);
               student[_address[i]] =true;
             stakeholders[_address[i]] = Stakeholder(true, false, 0 );
             }
        }
        

       
    }

    /// @notice fetch a specific election
    function fetchElection() public view onlyWhenNotPaused returns (Candidate[] memory) {
    
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

    /// @notice compile votes for an election
    function compileVotes(string memory _position) onlyWhenNotPaused onlyAccess public view  returns (uint total, uint winnigVotes, Candidate[] memory){
        uint winningVoteCount = 0;
        uint totalVotes=0;
        uint winningCandidateIndex = 0;
        Candidate[] memory items = new Candidate[](candidatesCount);
    
        for (uint i = 0; i < candidatesCount; i++) {
            if (candidates[i + 1].category == Category[_position]) {
                totalVotes += candidates[i + 1].voteCount;        
                if ( candidates[i + 1].voteCount > winningVoteCount) {
                    
                    winningVoteCount = candidates[i + 1].voteCount;
                    uint currentId = candidates[i + 1].id;
                    // winningCandidateIndex = i;
                    Candidate storage currentItem = candidates[currentId];
                    items[winningCandidateIndex] = currentItem;
                    winningCandidateIndex += 1;
                }
            }} 
             return (totalVotes, winningVoteCount, items);  
        }

   /// * @notice setDisabled() enables or disables votingProcess    
    function setDisabled(bool _value) public onlyWhenNotPaused onlyChairman {
          _disabled = _value;
    }

   /// * @notice setPaused() enables or disables functions    
    function setPaused(bool _value) public onlyChairman {
          _paused = _value;
    }
}
