# CardSense Class Diagram (Mermaid)

```mermaid
classDiagram
    %% ============ User Management ============
    class User {
        -int id
        -string email
        -string password_hash
        -string first_name
        -string last_name
        -datetime created_at
        -datetime last_login
        +register() bool
        +login() bool
        +logout() void
        +update_profile() bool
        +reset_password() bool
    }
    
    class UserProfile {
        -int id
        -int user_id
        -string phone
        -json notification_preferences
        -string theme_preference
        +update_preferences() bool
        +get_settings() json
    }
    
    %% ============ Transaction Management ============
    class Transaction {
        -int id
        -int user_id
        -decimal amount
        -datetime date
        -int category_id
        -int card_id
        -string merchant
        -string notes
        -datetime created_at
        +create() bool
        +update() bool
        +delete() bool
        +get_by_date_range() Transaction[]
        +get_by_category() Transaction[]
        +calculate_rewards() decimal
    }
    
    class TransactionCategory {
        -int id
        -string name
        -string icon
        -string color
        -string description
        +get_all_categories() TransactionCategory[]
        +create_custom_category() bool
    }
    
    class CSVImport {
        -int id
        -int user_id
        -string filename
        -datetime upload_date
        -string status
        -int rows_processed
        -int rows_failed
        +upload_file() bool
        +validate_format() bool
        +parse_csv() Transaction[]
        +import_transactions() bool
        +get_error_report() string[]
    }
    
    %% ============ Budget Management ============
    class Budget {
        -int id
        -int user_id
        -int category_id
        -decimal amount
        -string period
        -date start_date
        -date end_date
        -decimal alert_threshold
        +create() bool
        +update() bool
        +delete() bool
        +get_remaining() decimal
        +get_spent_percentage() float
        +is_exceeded() bool
    }
    
    class BudgetAlert {
        -int id
        -int budget_id
        -int user_id
        -string alert_type
        -int threshold_percentage
        -datetime triggered_at
        -bool is_read
        +check_threshold() bool
        +send_notification() void
        +mark_as_read() void
    }
    
    %% ============ Credit Card Management ============
    class CreditCard {
        -int id
        -string name
        -string issuer
        -decimal annual_fee
        -string image_url
        -bool is_active
        -text description
        +get_all_cards() CreditCard[]
        +get_card_details() CreditCard
        +get_rewards_for_category() RewardRule[]
    }
    
    class UserCard {
        -int id
        -int user_id
        -int card_id
        -string nickname
        -datetime added_date
        -bool is_primary
        +add_card() bool
        +remove_card() bool
        +set_primary() bool
        +get_user_cards() UserCard[]
    }
    
    class RewardRule {
        -int id
        -int card_id
        -int category_id
        -string reward_type
        -decimal reward_value
        -decimal cap_amount
        -string cap_period
        -date start_date
        -date end_date
        +calculate_reward() decimal
        +is_valid() bool
        +check_cap() bool
        +get_best_card_for_category() CreditCard
    }
    
    class RewardTracking {
        -int id
        -int user_id
        -int card_id
        -int transaction_id
        -decimal reward_amount
        -string reward_type
        -datetime earned_date
        +calculate_total_rewards() decimal
        +get_rewards_by_period() RewardTracking[]
        +get_rewards_by_card() RewardTracking[]
    }
    
    %% ============ Recommendation System ============
    class Recommendation {
        -int id
        -int user_id
        -string recommendation_type
        -int card_id
        -int category_id
        -decimal potential_value
        -text reason
        -datetime created_at
        -bool is_dismissed
        +generate_recommendations() Recommendation[]
        +analyze_spending_pattern() json
        +suggest_new_cards() CreditCard[]
        +optimize_current_usage() string[]
    }
    
    class Alert {
        -int id
        -int user_id
        -string alert_type
        -string title
        -text message
        -string priority
        -datetime created_at
        -bool is_read
        -string action_url
        +create_alert() bool
        +mark_as_read() void
        +dismiss() void
        +get_user_alerts() Alert[]
    }
    
    %% ============ Analytics & Reporting ============
    class SpendingAnalytics {
        -int id
        -int user_id
        -string period
        -decimal total_spent
        -decimal total_rewards
        -json category_breakdown
        -json card_usage_stats
        -datetime generated_at
        +generate_report() SpendingAnalytics
        +get_spending_trends() json
        +compare_periods() json
        +export_to_pdf() File
    }
    
    class Dashboard {
        -int user_id
        +get_summary() json
        +get_recent_transactions() Transaction[]
        +get_budget_status() Budget[]
        +get_top_cards() CreditCard[]
        +get_monthly_comparison() json
    }
    
    %% ============ Relationships ============
    User "1" --> "1" UserProfile
    User "1" --> "*" Transaction
    User "1" --> "*" Budget
    User "1" --> "*" UserCard
    User "1" --> "*" Alert
    User "1" --> "*" Recommendation
    User "1" --> "*" CSVImport
    User "1" --> "*" RewardTracking
    User "1" --> "1" Dashboard
    User "1" --> "*" SpendingAnalytics
    
    Transaction "*" --> "1" TransactionCategory
    Transaction "*" --> "1" CreditCard
    Transaction "1" --> "0..1" RewardTracking
    
    Budget "*" --> "1" TransactionCategory
    Budget "1" --> "*" BudgetAlert
    
    CreditCard "1" --> "*" UserCard
    CreditCard "1" --> "*" RewardRule
    CreditCard "1" --> "*" RewardTracking
    
    RewardRule "*" --> "1" TransactionCategory
    
    BudgetAlert --|> Alert
    BudgetAlert "*" --> "1" Budget
    
    Recommendation "*" --> "0..1" CreditCard
    Recommendation "*" --> "0..1" TransactionCategory
```

## Key Classes Description

### User Management
- **User**: Core user entity with authentication methods
- **UserProfile**: Extended user settings and preferences

### Transaction Management
- **Transaction**: Individual spending records
- **TransactionCategory**: Categorization system (groceries, gas, dining, etc.)
- **CSVImport**: Handles bulk transaction imports

### Budget Management
- **Budget**: Category-based spending limits
- **BudgetAlert**: Automated notifications for budget thresholds

### Credit Card Management
- **CreditCard**: Database of available credit cards
- **UserCard**: User's personal credit card wallet
- **RewardRule**: Card-specific reward rates and rules
- **RewardTracking**: Historical record of earned rewards

### Intelligence Layer
- **Recommendation**: Personalized card and spending suggestions
- **Alert**: Notification system for various events
- **SpendingAnalytics**: Statistical analysis and reporting
- **Dashboard**: Aggregated view of user data

