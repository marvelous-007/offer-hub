# Smart Contracts Overview

## Introduction

The Offer Hub platform is powered by a comprehensive suite of Soroban smart contracts that work together to create a secure, decentralized freelance marketplace. This document provides an architectural overview of how all contracts interact to deliver platform functionality.

## Contract Architecture

```mermaid
graph TB
    User[User Registry] --> Publication[Publication Contract]
    User --> Rating[Rating Contract]
    
    Publication --> Escrow[Escrow Contract]
    Rating --> NFT[Reputation NFT]
    
    Factory[Escrow Factory] --> Escrow
    Escrow --> Dispute[Dispute Contract]
    Escrow --> Fee[Fee Manager]
    
    Dispute --> Fee
    Emergency[Emergency Contract] --> User
    Emergency --> Escrow
    Emergency --> Dispute
    
    Fee --> User
    NFT --> Rating
    
    style User fill:#e1f5fe
    style Escrow fill:#f3e5f5
    style Factory fill:#fff3e0
    style Dispute fill:#ffebee
    style Emergency fill:#fff8e1
    style Fee fill:#e8f5e8
    style Publication fill:#fce4ec
    style NFT fill:#f1f8e9
    style Rating fill:#e3f2fd
```

## Core Contracts

### 1. User Registry Contract
**Purpose:** Foundational identity and access control system

**Key Features:**
- Multi-level user verification (Basic, Premium, Enterprise)
- Blacklist management for malicious users
- Admin and moderator role management
- Bulk operations for administrative efficiency

**Integration:** All other contracts reference user verification status

---

### 2. Escrow Contract
**Purpose:** Secure payment management between clients and freelancers

**Key Features:**
- Milestone-based payment system
- Dispute integration with automatic resolution
- Fee calculation and collection
- Auto-release functionality with timeout

**Integration:** Central to payment flows, integrates with Fee Manager and Dispute contracts

---

### 3. Escrow Factory
**Purpose:** Standardized deployment and management of escrow contracts

**Key Features:**
- Batch escrow deployment from WASM
- Centralized contract management
- Batch operations across multiple escrows
- Archive system for completed contracts

**Integration:** Creates and manages Escrow Contract instances

---

### 4. Dispute Resolution Contract
**Purpose:** Two-tier mediation and arbitration system

**Key Features:**
- Mediation → Arbitration escalation process
- Evidence submission with IPFS support
- Timeout-based automatic resolution
- Direct escrow integration for fund release

**Integration:** Called by Escrow contracts for conflict resolution

---

### 5. Fee Manager Contract
**Purpose:** Centralized fee calculation and collection

**Key Features:**
- Configurable fee rates for different operations
- Premium user exemptions
- Transparent fee calculation
- Platform balance management

**Integration:** Used by all contracts requiring fee processing

## Supporting Contracts

### 6. Publication Contract
**Purpose:** On-chain registry for services and projects

**Key Features:**
- Decentralized publication registry
- User-specific publication counters
- Data validation and event emission
- Off-chain indexing support

**Integration:** First step in project creation workflow

---

### 7. Reputation NFT Contract
**Purpose:** Achievement-based NFT system

**Key Features:**
- Automatic achievement minting based on ratings
- Milestone-based rewards
- Integration with rating system
- IPFS metadata storage

**Integration:** Triggered by Rating Contract achievements

---

### 8. Rating Contract
**Purpose:** User rating and feedback system

**Key Features:**
- Rating submission and aggregation
- Anti-spam and validation measures
- Statistics calculation
- Achievement trigger integration

**Integration:** Feeds data to Reputation NFT contract

---

### 9. Emergency Contract
**Purpose:** Platform safety and crisis management

**Key Features:**
- Emergency pause/unpause functionality
- Circuit breaker protection
- Fund recovery system
- Emergency contact network

**Integration:** Can pause all other contracts during emergencies

## Contract Interaction Flows

### 1. Project Creation Flow
```
User → Publication Contract (publish project)
     → Escrow Factory (deploy escrow)
     → Escrow Contract (initialize)
     → Fee Manager (calculate fees)
```

**Code Example:**
```typescript
// Publish a new project
const publicationTx = await publicationContract.publish({
  title: "Website Development",
  description: "Build a modern React website",
  budget: 5000,
  deadline: "2024-02-01",
  category: "Web Development"
});

// Deploy escrow contract
const escrowAddress = await escrowFactory.deploy({
  projectId: publicationTx.projectId,
  clientAddress: userAddress,
  freelancerAddress: selectedFreelancer,
  totalAmount: 5000
});

// Initialize escrow with milestones
await escrowContract.initialize({
  escrowAddress,
  milestones: [
    { id: "design", amount: 1500, description: "UI/UX Design" },
    { id: "development", amount: 2500, description: "Frontend Development" },
    { id: "testing", amount: 1000, description: "Testing & Deployment" }
  ]
});
```

### 2. Payment Flow
```
Client → Escrow Contract (deposit funds)
       → Fee Manager (collect fees)
       → Escrow Contract (milestone management)
       → Freelancer (release funds)
```

**Code Example:**
```typescript
// Client deposits funds
await escrowContract.deposit({
  escrowAddress,
  amount: 5000,
  token: "USDC"
});

// Fee manager calculates and collects fees
const feeAmount = await feeManager.calculateFee({
  amount: 5000,
  userType: "premium",
  operation: "escrow_deposit"
});

// Release funds for completed milestone
await escrowContract.releaseFunds({
  escrowAddress,
  milestoneId: "design",
  freelancerAddress: freelancerAddress
});
```

### 3. Dispute Flow
```
Client/Freelancer → Dispute Contract (open dispute)
                 → Evidence submission
                 → Mediation/Arbitration
                 → Escrow Contract (resolve payment)
                 → Fee Manager (collect dispute fees)
```

**Code Example:**
```typescript
// Open a dispute
const disputeId = await disputeContract.openDispute({
  escrowAddress,
  initiator: userAddress,
  reason: "Work quality not meeting requirements",
  evidence: ["ipfs://evidence1", "ipfs://evidence2"]
});

// Submit additional evidence
await disputeContract.submitEvidence({
  disputeId,
  evidence: "ipfs://additional_evidence",
  submitter: userAddress
});

// Mediator resolves dispute
await disputeContract.resolveDispute({
  disputeId,
  resolution: "partial_payment",
  freelancerAmount: 3000,
  clientRefund: 2000,
  mediatorAddress: mediatorAddress
});
```

### 4. Reputation Flow
```
Client/Freelancer → Rating Contract (submit rating)
                 → Reputation NFT (check achievements)
                 → Auto-mint NFTs for milestones
                 → Update user reputation score
```

### 5. Emergency Flow
```
Emergency Admin → Emergency Contract (pause/unpause)
               → All Contracts (check pause status)
               → Circuit Breaker (automatic protection)
               → Fund Recovery (stuck fund resolution)
```

## Data Flow Between Contracts

### User Verification Chain
1. **User Registry** verifies users
2. **All contracts** check verification status
3. **Fee Manager** applies premium user discounts
4. **Emergency Contract** can blacklist users

### Payment Processing Chain
1. **Publication Contract** creates project record
2. **Escrow Factory** deploys payment contract
3. **Escrow Contract** manages payments
4. **Fee Manager** calculates and collects fees
5. **Dispute Contract** handles conflicts

### Reputation Chain
1. **Rating Contract** aggregates user feedback
2. **Reputation NFT** awards achievements
3. **User Registry** tracks reputation levels
4. **Fee Manager** provides premium benefits

## Security Architecture

### Multi-Layer Security
- **Contract Level**: Individual contract security measures
- **Integration Level**: Cross-contract authorization checks
- **Platform Level**: Emergency controls and circuit breakers

### Access Control Matrix
```
Contract          | Admin | Moderator | User | Public
------------------|-------|-----------|------|--------
User Registry     |  ✓    |    ✓     |  ✓   |   ✓
Escrow            |  ✗    |    ✗     |  ✓   |   ✗
Escrow Factory    |  ✓    |    ✗     |  ✓   |   ✗
Dispute           |  ✓    |    ✓     |  ✓   |   ✗
Fee Manager       |  ✓    |    ✗     |  ✗   |   ✓
Publication       |  ✗    |    ✗     |  ✓   |   ✓
Rating            |  ✓    |    ✗     |  ✓   |   ✓
Reputation NFT    |  ✓    |    ✓     |  ✗   |   ✓
Emergency         |  ✓    |    ✗     |  ✗   |   ✓
```

## API Reference

### User Registry Contract
```typescript
// User management
registerUser(userData: UserData): Promise<TransactionResult>
verifyUser(userId: string, level: VerificationLevel): Promise<boolean>
blacklistUser(userId: string, reason: string): Promise<void>
getUserStatus(userId: string): Promise<UserStatus>

// Admin functions
setAdminRole(userId: string, role: AdminRole): Promise<void>
bulkVerifyUsers(userIds: string[], level: VerificationLevel): Promise<void>
```

### Escrow Contract
```typescript
// Payment management
deposit(amount: number, token: string): Promise<TransactionResult>
releaseFunds(milestoneId: string): Promise<TransactionResult>
withdrawFunds(amount: number): Promise<TransactionResult>

// Milestone management
createMilestone(milestone: MilestoneData): Promise<string>
updateMilestone(milestoneId: string, updates: Partial<MilestoneData>): Promise<void>
completeMilestone(milestoneId: string): Promise<void>

// Dispute integration
openDispute(reason: string, evidence: string[]): Promise<string>
```

### Escrow Factory Contract
```typescript
// Contract deployment
deployEscrow(config: EscrowConfig): Promise<string>
batchDeployEscrows(configs: EscrowConfig[]): Promise<string[]>

// Management
getEscrowAddress(projectId: string): Promise<string>
archiveEscrow(escrowAddress: string): Promise<void>
getActiveEscrows(): Promise<string[]>
```

### Dispute Resolution Contract
```typescript
// Dispute management
openDispute(disputeData: DisputeData): Promise<string>
submitEvidence(disputeId: string, evidence: string): Promise<void>
resolveDispute(disputeId: string, resolution: DisputeResolution): Promise<void>

// Mediation
assignMediator(disputeId: string, mediatorId: string): Promise<void>
escalateToArbitration(disputeId: string): Promise<void>
```

### Fee Manager Contract
```typescript
// Fee calculation
calculateFee(amount: number, userType: UserType, operation: OperationType): Promise<number>
collectFee(amount: number, userAddress: string): Promise<TransactionResult>

// Configuration
setFeeRate(operation: OperationType, rate: number): Promise<void>
setPremiumDiscount(discount: number): Promise<void>
```

## Event System

### Cross-Contract Events
All contracts emit events that enable:
- **Real-time monitoring** of platform activity
- **Off-chain indexing** for fast queries
- **Integration triggers** between contracts
- **Audit trail** for all operations

### Key Event Categories
- **User Events**: Registration, verification, reputation changes
- **Payment Events**: Deposits, releases, fee collection
- **Dispute Events**: Creation, resolution, evidence submission
- **System Events**: Emergency actions, configuration changes

## Deployment Strategy

### Contract Dependencies
1. **Core Infrastructure**: User Registry, Fee Manager, Emergency
2. **Payment System**: Escrow Factory, Escrow Contract
3. **Dispute System**: Dispute Contract
4. **Content System**: Publication Contract
5. **Reputation System**: Rating Contract, Reputation NFT

### Deployment Order
```
1. User Registry Contract
2. Fee Manager Contract  
3. Emergency Contract
4. Escrow Contract (WASM)
5. Escrow Factory Contract
6. Dispute Resolution Contract
7. Publication Contract
8. Rating Contract
9. Reputation NFT Contract
```

**Deployment Code Example:**
```typescript
// Deploy contracts in correct order
const deploymentOrder = [
  'UserRegistry',
  'FeeManager', 
  'Emergency',
  'Escrow',
  'EscrowFactory',
  'DisputeResolution',
  'Publication',
  'Rating',
  'ReputationNFT'
];

for (const contractName of deploymentOrder) {
  const contract = await deployContract(contractName, {
    network: 'testnet',
    gasLimit: 1000000
  });
  
  console.log(`${contractName} deployed at: ${contract.address}`);
  
  // Verify deployment
  await verifyContract(contract.address, contractName);
}
```

## Error Handling

### Common Error Scenarios
```typescript
// Escrow contract errors
try {
  await escrowContract.releaseFunds(milestoneId);
} catch (error) {
  switch (error.code) {
    case 'INSUFFICIENT_FUNDS':
      console.error('Not enough funds in escrow');
      break;
    case 'DISPUTE_ACTIVE':
      console.error('Cannot release funds during active dispute');
      break;
    case 'MILESTONE_NOT_COMPLETE':
      console.error('Milestone must be completed before release');
      break;
    case 'UNAUTHORIZED':
      console.error('Only authorized parties can release funds');
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}

// User registry errors
try {
  await userRegistry.verifyUser(userId, 'premium');
} catch (error) {
  if (error.code === 'USER_NOT_FOUND') {
    console.error('User does not exist');
  } else if (error.code === 'INSUFFICIENT_PERMISSIONS') {
    console.error('Admin permissions required');
  }
}

// Dispute resolution errors
try {
  await disputeContract.resolveDispute(disputeId, resolution);
} catch (error) {
  if (error.code === 'DISPUTE_NOT_FOUND') {
    console.error('Dispute does not exist');
  } else if (error.code === 'DISPUTE_ALREADY_RESOLVED') {
    console.error('Dispute has already been resolved');
  }
}
```

## Testing Strategy

### Integration Testing
- **Cross-contract interactions** validation
- **End-to-end workflows** testing
- **Event propagation** verification
- **Security boundary** testing

### Test Categories
- **Unit Tests**: Individual contract functionality
- **Integration Tests**: Multi-contract workflows
- **Security Tests**: Attack vector validation
- **Performance Tests**: Gas optimization and scalability

## Future Enhancements

### Planned Integrations
1. **Oracle Integration**: External data feeds for automated decisions
2. **Cross-Chain Bridges**: Multi-chain contract deployment
3. **Governance Contracts**: Decentralized platform governance
4. **Insurance Contracts**: Risk mitigation for high-value transactions

### Scalability Improvements
1. **Layer 2 Integration**: Reduced transaction costs
2. **State Channels**: Off-chain payment processing
3. **Batch Processing**: Improved efficiency for bulk operations
4. **Archive Systems**: Historical data management

## Monitoring and Maintenance

### Key Metrics
- **Contract utilization** rates
- **Transaction success** rates
- **Fee collection** efficiency
- **Dispute resolution** times
- **Emergency activation** frequency

### Maintenance Procedures
- **Regular security audits** of all contracts
- **Performance monitoring** and optimization
- **Emergency response** procedures
- **Upgrade planning** and deployment

## Conclusion

The Offer Hub smart contract ecosystem provides a comprehensive, secure, and scalable foundation for decentralized freelance operations. The modular architecture enables:

- **Secure payments** through battle-tested escrow mechanisms
- **Fair dispute resolution** with multi-tier arbitration
- **Transparent fee management** with premium user benefits
- **Robust reputation system** with achievement-based rewards
- **Emergency protection** with platform-wide safety controls

Each contract is designed to work independently while integrating seamlessly with others, creating a resilient and feature-rich decentralized platform.

---

## Related Documentation

For detailed information about individual contracts, refer to their specific documentation files:

### Core Infrastructure
- **[User Registry Contract](./USER_REGISTRY_CONTRACT.md)** - User verification and access control
- **[Emergency Contract](./EMERGENCY_CONTRACT.md)** - Platform safety and crisis management
- **[Fee Manager Contract](./FEE_MANAGER_CONTRACT.md)** - Centralized fee calculation and collection

### Payment System
- **[Escrow Contract](./ESCROW_CONTRACT.md)** - Secure payment management with milestone support
- **[Escrow Factory](./ESCROW_FACTORY.md)** - Standardized deployment and batch management

### Dispute & Content
- **[Dispute Resolution Contract](./DISPUTE_CONTRACT.md)** - Two-tier mediation and arbitration system
- **[Publication Contract](./PUBLICATION_CONTRACT.md)** - On-chain registry for services and projects

### Reputation System
- **[Rating System Integration](./RATING_SYSTEM_INTEGRATION.md)** - User rating and feedback system
- **[Reputation NFT Contract](./REPUTATION_NFT_CONTRACT.md)** - Achievement-based NFT rewards

### Implementation Guides
- **[Freelancer Profile Implementation](./FREELANCER_PROFILE_IMPLEMENTATION.md)** - Frontend profile system integration
- **[Contributors Guideline](./CONTRIBUTORS_GUIDELINE.md)** - Development and contribution guidelines