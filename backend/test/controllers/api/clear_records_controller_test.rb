require "test_helper"

class Api::ClearRecordsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_clear_records_create_url
    assert_response :success
  end
end
