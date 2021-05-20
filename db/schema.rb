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

ActiveRecord::Schema.define(version: 2021_05_19_135923) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "security_name"
    t.string "symbol"
    t.integer "sector"
    t.integer "instrument_type"
    t.integer "nepse_company_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["nepse_company_id"], name: "index_companies_on_nepse_company_id"
    t.index ["sector"], name: "index_companies_on_sector"
    t.index ["symbol"], name: "index_companies_on_symbol"
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

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end