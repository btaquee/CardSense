# CardSense Diagrams

This directory contains comprehensive UML diagrams and architecture documentation for the CardSense project.

## 📁 Files Overview

### UML Diagrams

| File | Description | Format |
|------|-------------|--------|
| `class_diagram.puml` | Complete class diagram with all entities and relationships | PlantUML |
| `class_diagram.md` | Class diagram in Mermaid format with descriptions | Markdown + Mermaid |
| `usecase_diagram.puml` | Comprehensive use case diagram | PlantUML |
| `usecase_diagram.md` | Use case diagrams with detailed scenarios | Markdown + Mermaid |
| `usecase_scenarios.puml` | Detailed scenario-specific use case flows | PlantUML |

### Documentation

| File | Description |
|------|-------------|
| `ARCHITECTURE.md` | Complete system architecture and design document |

## 🎨 Viewing the Diagrams

### PlantUML Files (.puml)

**Option 1: Online Viewer**
- Copy the contents of any `.puml` file
- Visit [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
- Paste and view

**Option 2: VS Code**
- Install the "PlantUML" extension
- Open any `.puml` file
- Press `Alt+D` to preview

**Option 3: IntelliJ IDEA**
- Install the "PlantUML integration" plugin
- Right-click on `.puml` file → "Show Diagram"

### Mermaid Diagrams (.md)

**Option 1: GitHub**
- View directly on GitHub (Mermaid is natively supported)

**Option 2: VS Code**
- Install "Markdown Preview Mermaid Support" extension
- Open any `.md` file with Mermaid diagrams
- Use markdown preview

**Option 3: Online Editor**
- Visit [Mermaid Live Editor](https://mermaid.live/)
- Copy and paste Mermaid code

## 📊 Diagram Descriptions

### Class Diagram

The class diagram shows the complete object-oriented structure of CardSense including:

**Core Modules:**
- **User Management**: User, UserProfile
- **Transaction Management**: Transaction, TransactionCategory, CSVImport
- **Budget Management**: Budget, BudgetAlert
- **Card Management**: CreditCard, UserCard, RewardRule, RewardTracking
- **Intelligence**: Recommendation, Alert, SpendingAnalytics
- **Presentation**: Dashboard

**Key Relationships:**
- Users have multiple transactions, budgets, and cards
- Transactions belong to categories and cards
- Budgets are category-specific with automated alerts
- Cards have reward rules mapped to spending categories
- Recommendations analyze patterns to suggest optimizations

### Use Case Diagrams

The use case diagrams illustrate user interactions with the system:

**Actors:**
- **User**: Registered user performing authenticated actions
- **Guest**: Unregistered visitor (registration only)
- **System**: Automated background processes

**Key Use Cases:**
1. **Tracking Spending and Budgets**: Manual entry, CSV upload, budget monitoring
2. **Optimizing Credit Card Rewards**: Card recommendations, reward calculations
3. **Personalized Recommendations**: Spending insights, card suggestions, alerts

### Sequence Diagrams

Included in `usecase_diagram.md`, showing detailed interaction flows for:
- Transaction tracking workflow
- Card recommendation process
- Alert and recommendation generation

## 🏗️ Architecture Overview

The system follows a three-tier architecture:

```
┌─────────────────┐
│  Frontend (React) │
│   - TypeScript   │
│   - Redux       │
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│  Backend (Django) │
│   - REST API    │
│   - Auth Logic  │
│   - Reward Engine│
└────────┬────────┘
         │ ORM
┌────────▼────────┐
│  Database       │
│  (SQLite/PG)    │
└─────────────────┘
```

## 📋 Key Features Modeled

### 1. Transaction Management
- Manual transaction entry with categorization
- CSV import with validation
- Transaction filtering and search
- Spending summaries and trends

### 2. Budget Tracking
- Category-based budget limits
- Real-time budget monitoring
- Threshold-based alerts (80%, 90%, 100%)
- Visual progress indicators

### 3. Card Optimization
- Comprehensive card database with reward rules
- Intelligent card recommendations
- Reward calculation considering caps and limits
- Card comparison for specific purchases

### 4. Personalized Insights
- Spending pattern analysis
- Recommendation engine for new cards
- Reward optimization suggestions
- Proactive alerts and notifications

### 5. Analytics & Reporting
- Interactive dashboard
- Spending trends and breakdowns
- Category-wise analysis
- Export capabilities

## 🔄 Data Flow Example

### Scenario: User Makes a Purchase

```
User Input → Transaction Created → Category Assigned
     ↓
Budget Updated → Check Threshold → Alert if Needed
     ↓
Calculate Rewards → Track Earnings → Update Analytics
     ↓
Analyze Pattern → Generate Recommendations → Notify User
```

## 🎯 Design Principles

### 1. Separation of Concerns
- Clear boundaries between presentation, business logic, and data layers
- Modular architecture for independent development

### 2. Scalability
- Stateless API design
- Database optimization with indexes
- Caching strategies for frequent queries

### 3. Security
- JWT-based authentication
- Input validation and sanitization
- HTTPS enforcement in production

### 4. User Experience
- Real-time updates
- Interactive visualizations
- Mobile-responsive design
- Progressive Web App capabilities

## 📝 Implementation Notes

### Core Entities

**User**: Central entity connecting all user-specific data
- Has many: Transactions, Budgets, UserCards, Alerts
- Has one: UserProfile, Dashboard

**Transaction**: Individual spending record
- Belongs to: User, Category, CreditCard
- Creates: RewardTracking entry

**Budget**: Category-specific spending limit
- Belongs to: User, Category
- Generates: BudgetAlerts when thresholds reached

**CreditCard**: Card in the database
- Has many: RewardRules, UserCards, RewardTracking
- Rules define rewards per category

**RewardRule**: Defines how rewards are earned
- Belongs to: CreditCard, Category
- Includes: reward_type, reward_value, caps, dates

### Business Logic Highlights

**Card Recommendation Algorithm:**
1. User inputs purchase (amount, category)
2. Query all cards in user's wallet
3. For each card:
   - Find matching reward rules for category
   - Calculate potential reward
   - Check if caps are reached
   - Rank by reward value
4. Return best card with reasoning

**Budget Alert System:**
1. Monitor all active budgets
2. Calculate current spending vs limit
3. Check against thresholds (80%, 90%, 100%)
4. If threshold reached:
   - Create alert
   - Send notification
   - Update dashboard

**Spending Pattern Analysis:**
1. Aggregate transactions by category
2. Identify high-spend categories
3. Query card database for better options
4. Calculate potential additional rewards
5. Generate personalized recommendations

## 🚀 Next Steps

### Immediate Implementation
1. Set up Django models based on class diagram
2. Create database migrations
3. Implement REST API endpoints
4. Build React components
5. Integrate authentication system

### Future Enhancements
1. Machine learning for smarter recommendations
2. Real-time transaction syncing with bank APIs
3. Mobile app (React Native)
4. Social features (compare with friends)
5. Investment tracking integration

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [PlantUML Guide](https://plantuml.com/guide)
- [Mermaid Documentation](https://mermaid.js.org/)

---

**Last Updated:** October 2024  
**Project:** CardSense - Budget Tracker & Credit Card Reward Optimizer  
**Team:** BBAX (Xiyuan Wu, Andrew Do, Brandon Nguyen, Burhanuddin Taquee)

