module Api
  class ClearRecordsController < ApplicationController
    def create
      clear_record = ClearRecord.new(clear_record_params)
      clear_record.user = current_user if user_signed_in?

      if clear_record.save
        render json: { message: "記録を保存しました" }, status: :created
      else
        render json: { errors: clear_record.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def index
      clear_records = ClearRecord.order(created_at: :desc).limit(100)
      render json: clear_records.as_json(only: [:id, :user_id, :time_in_seconds, :created_at])
    end

    private

    def clear_record_params
      params.require(:clear_record).permit(:time_in_seconds)
    end
  end
end
