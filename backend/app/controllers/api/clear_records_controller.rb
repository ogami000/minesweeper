module Api
  class ClearRecordsController < ApplicationController


    def create
      clear_record = ClearRecord.new(clear_record_params)
      clear_record.user = current_user if user_signed_in?

      if clear_record.save
        Rails.logger.debug "params: #{params.inspect}"
        render json: { message: "記録を保存しました" }, status: :created
      else
        render json: { errors: clear_record.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def index
      clear_records = ClearRecord.order(created_at: :desc).limit(50)
      render json: clear_records.map { |record|
      {
        id: record.id,
        time_in_seconds: record.time_in_seconds,
        difficulty: record.difficulty,
        created_at: record.created_at,
        nickname: record.user&.nickname
      }
    }
    end

    private

    def clear_record_params
      params.require(:clear_record).permit(:time_in_seconds, :difficulty)
    end
  end
end
