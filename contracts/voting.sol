//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

/// @author TeamB - Blockgames Internship 22
/// @title A Voting Dapp
contract ZuriSchool {
    
    /// @notice structure for stakeholders
    struct Stakeholder {
        bool isRegistered;
        bool hasVoted;  
        uint votedCandidateId;   
    }

    /// @notice structure for candidates
    struct Candidate {
        string name;   
        uint voteCount; 
    }

    /// @notice voting process
    enum VotingProcess {
        RegisteredStakeholders, 
        CandidatesRegistrationStarted,
        CandidatesRegistrationEnded,
        VotingStarted,
        VotingEnded,
        VotesCounted
    }

    /// @notice declare state variable votingprocess
    VotingProcess public votingProcess;

    /// @notice declare state variable teacher
    address public teacher;

    /// @notice declare state variable chairman
    address public chairman;

    /// @notice mapping for list of stakeholders
    mapping(address => Stakeholder) public stakeholders;

    /// @notice array for candidates
    Candidate[] public candidates;

    /// @dev id of winner
    uint private winningCandidateId;

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
    
    /// @notice modifier to check that only the registered stakeholders can call a function
    modifier onlyRegisteredStakeholder() {

        /// @notice check that the sender is a registered stakeholder
        require(stakeholders[msg.sender].isRegistered, 
           "You must be a registered stakeholder");
       _;
    }
    
    /// @notice modifier to check that function can only be called during stakeholder registration
    modifier onlyDuringStakeholdersRegistration() {

        /// @notice require that this process only occurs before candidates start registering
        require(votingProcess == VotingProcess.RegisteredStakeholders, 
           "Candidates registration has already started");
       _;
    }
    
    /// @notice modifier to check that function can only be called during candidate registration
    modifier onlyDuringCandidatesRegistration() {

        /// @notice require that this process only occurs during candidates registertion
        require(votingProcess == VotingProcess.CandidatesRegistrationStarted, 
           "You can only do this during candidates registration");
       _;
    }
    
    /// @notice modifier to check that function can only be called after candidate registration
    modifier onlyAfterCandidatesRegistration() {

        /// @notice require that this process only occurs after candidates registration
        require(votingProcess == VotingProcess.CandidatesRegistrationEnded, 
           "You can only do this after candidates registration has ended");
       _;
    }
    
    /// @notice modifier to check that function can only be called during the voting period
    modifier onlyDuringVotingSession() {

        /// @notice require that this process only occurs during the voting period
        require(votingProcess == VotingProcess.VotingStarted, 
           "You can only do this during the voting session");
       _;
    }
    
    /// @notice modifier to check that function can only be called after the voting period
    modifier onlyAfterVotingSession() {

        /// @notice require that this process only occurs after the voting period
        require(votingProcess == VotingProcess.VotingEnded,  
           "You can only do this after the voting has ended");
       _;
    }
    
    /// @notice modifier to check that function can only be called after the votes have been counted
    modifier onlyAfterVotesCounted() {

        /// @notice require that this process only occurs after the votes are counted
        require(votingProcess == VotingProcess.VotesCounted,  
           "Only allowed after votes have been counted");
       _;
    }
    
    /// @notice emit when stakeholder resisters
    event StakeholderRegisteredEvent (
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
    
    constructor() {
        chairman = msg.sender;
        votingProcess = VotingProcess.RegisteredStakeholders;
    }
    
    /// @notice function for the start of candidate registration
    function startCandidatesRegistration()

        /// @dev function can only be called by chairman
        /// @dev function can only be called by teachers
        /// @dev function can only be called during the registration of stakeholder
        public onlyTeacher onlyChairman onlyDuringStakeholdersRegistration {
        votingProcess = VotingProcess.CandidatesRegistrationStarted;
        
        emit CandidatesRegistrationStartedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.RegisteredStakeholders, votingProcess);
    }
    
    /// @notice function for the end of candidate registration
    function endCandidatesRegistration() 
        public onlyTeacher onlyChairman onlyDuringCandidatesRegistration {
        votingProcess = VotingProcess.CandidatesRegistrationEnded;
        
        emit CandidatesRegistrationEndedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.CandidatesRegistrationStarted, votingProcess);
    }
    
    /// @notice store candidates information
    function registerCandidate(string memory candidateName) 
        public onlyRegisteredStakeholder onlyDuringCandidatesRegistration {
        candidates.push(Candidate({
            name: candidateName,
            voteCount: 0
        }));
        
        emit CandidateRegisteredEvent(candidates.length - 1);
    }
    
    /// @notice retrieve candidates number
     function getCandidatesNumber() public view
         returns (uint) {
         return candidates.length;
     }
     
     function getCandidateName(uint index) public view 
         returns (string memory) {
         return candidates[index].name;
     }    

    function startVotingSession() 
        public onlyChairman onlyAfterCandidatesRegistration {
        votingProcess = VotingProcess.VotingStarted;
        
        emit VotingStartedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.CandidatesRegistrationEnded, votingProcess);
    }
    
    function endVotingSession() 
        public onlyChairman onlyDuringVotingSession {
        votingProcess = VotingProcess.VotingEnded;
        
        emit VotingEndedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.VotingStarted, votingProcess);        
    }

    function vote(uint candidateId) 
        onlyRegisteredStakeholder 
        onlyDuringVotingSession public {
        require(!stakeholders[msg.sender].hasVoted, 
            "the stakeholder has already voted");

        stakeholders[msg.sender].hasVoted = true;
        stakeholders[msg.sender].votedCandidateId = candidateId;

        candidates[candidateId].voteCount += 1;

        emit VotedEvent(msg.sender, candidateId);
    }

    function countVotes() onlyChairman onlyTeacher onlyAfterVotingSession public {
        uint winningVoteCount = 0;
        uint winningCandidateIndex = 0;
        
        for (
            uint i = 0;
            i < candidates.length;
            i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateIndex = i;
            }
        }
        
        winningCandidateId = winningCandidateIndex;
        votingProcess = VotingProcess.VotesCounted;
        
        emit VotesCountedEvent();
        emit VotingProcessChangeEvent(
            VotingProcess.VotingEnded, votingProcess);     
    }
    
    function getWinningCandidateId() onlyAfterVotesCounted public view
       returns (uint) {
       return winningCandidateId;
    }
    
    function getWinningCandidateName() 
       onlyAfterVotesCounted public view
       returns (string memory) {
       return candidates[winningCandidateId].name;
    }  
    
    function getWinningCandidateVoteCounts() onlyAfterVotesCounted public view
       returns (uint) {
       return candidates[winningCandidateId].voteCount;
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

    function getVotingProcess() public view
        returns (VotingProcess) {
        return votingProcess;       
    }
    
    function registerStakeholder(address _stakeholderAddress) 
        public onlyTeacher onlyChairman onlyDuringStakeholdersRegistration {
        
        require(!stakeholders[_stakeholderAddress].isRegistered, 
           "the stakeholder is already registered");
        
        stakeholders[_stakeholderAddress].isRegistered = true;
        stakeholders[_stakeholderAddress].hasVoted = false;
        stakeholders[_stakeholderAddress].votedCandidateId = 0;
        
        emit StakeholderRegisteredEvent(_stakeholderAddress);
    }
}