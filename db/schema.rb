# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_06_16_190855) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cache_stores", force: :cascade do |t|
    t.string "key"
    t.text "entry"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["key"], name: "index_cache_stores_on_key"
  end

  create_table "companies", force: :cascade do |t|
    t.string "security_name"
    t.string "symbol"
    t.integer "sector"
    t.integer "instrument_type"
    t.integer "nepse_company_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.index ["nepse_company_id"], name: "index_companies_on_nepse_company_id"
    t.index ["sector"], name: "index_companies_on_sector"
    t.index ["symbol"], name: "index_companies_on_symbol"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at", precision: 6
    t.datetime "updated_at", precision: 6
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "financial_reports", force: :cascade do |t|
    t.string "symbol"
    t.integer "year"
    t.integer "quarter"
    t.decimal "net_profit", precision: 16, scale: 2
    t.decimal "net_interest_income", precision: 16, scale: 2
    t.decimal "distributable_profit", precision: 16, scale: 2
    t.decimal "shares_outstanding", precision: 16, scale: 2
    t.decimal "book_value", precision: 16, scale: 2
    t.decimal "eps", precision: 16, scale: 2
    t.decimal "roe", precision: 16, scale: 2
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["symbol"], name: "index_financial_reports_on_symbol"
    t.index ["year", "quarter"], name: "index_financial_reports_on_year_and_quarter"
    t.index ["year"], name: "index_financial_reports_on_year"
  end

  create_table "price_histories", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "symbol"
    t.datetime "business_date"
    t.decimal "average_traded_price", precision: 8, scale: 2
    t.decimal "price_change", precision: 8, scale: 2
    t.decimal "volume_change", precision: 8, scale: 2
    t.integer "close_price"
    t.integer "previous_day_close_price"
    t.integer "high_price"
    t.integer "open_price"
    t.integer "low_price"
    t.datetime "last_updated_time"
    t.bigint "total_traded_quantity"
    t.bigint "total_traded_value"
    t.bigint "total_trades"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["business_date"], name: "index_price_histories_on_business_date"
    t.index ["company_id"], name: "index_price_histories_on_company_id"
    t.index ["symbol"], name: "index_price_histories_on_symbol"
    t.index ["total_traded_quantity"], name: "index_price_histories_on_total_traded_quantity"
  end

  create_table "share_transactions", force: :cascade do |t|
    t.bigint "user_id"
    t.string "symbol"
    t.integer "transaction_type", default: 0
    t.integer "quantity"
    t.integer "price"
    t.datetime "business_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_share_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "role", default: 0
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "watchlists", force: :cascade do |t|
    t.bigint "user_id"
    t.string "symbol"
    t.datetime "business_date"
    t.integer "category", default: 0
    t.text "remarks"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_watchlists_on_user_id"
  end

end
