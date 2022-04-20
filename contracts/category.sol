// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract ZuriSchool {

     /// @notice mapping for list of stakeholders
    mapping(address => Stakeholder) public stakeholders;
    
    enum Category {
        president, sudentunion, headboy
    }

    enum Candidate {
        candidate1, candidate2, candidate3
    }

    struct Election {
        Category category;
        Candidate candidate;
    }

    /// @notice structure for stakeholders
    struct Stakeholder {
        bool isRegistered;
        bool hasVoted;  
        uint votedCandidateId;   
    }

    /// @notice structure for candidates
    struct Cdate {
        uint   id;
        string name;   
        string position;
        uint voteCount; 
    }
    mapping(uint => Cdate) public candidate;

    Election public election;
    // Cdate public candidate;

    function Vote(Category _category, Candidate _candidate) public returns (Category, Candidate) {
        election.category = _category;
        election.candidate = _candidate;

        stakeholders[msg.sender].hasVoted = true;
        candidate[uint256 (_candidate)].voteCount += 1;

        return (election.category, election.candidate);       
    }
}