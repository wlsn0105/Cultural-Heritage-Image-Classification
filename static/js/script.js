function uploadImage() {
    var formData = new FormData();
    formData.append("image", $("#image-input")[0].files[0]);

    // 로딩 스피너 표시
    $("#loader").show();

    // 플레이스홀더 숨기기
    $("#image-placeholder").hide();
    $("#result-placeholder").hide();

    $.ajax({
        url: "/upload",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            // 이미지 표시
            var imageUrl = URL.createObjectURL($("#image-input")[0].files[0]);
            $("#uploaded-image").attr("src", imageUrl);

            $("#result-container").html("<h2>Detected Items:</h2>");
            response.labels.forEach(function (label) {
                $("#result-container").append("<p>" + label.description + "</p>");
            });

            $("#result-container").append("<h2>Predicted Price:</h2>");
            $("#result-container").append("<p>" + response.predicted_price + "</p>");

            // 로딩 스피너 숨기기
            $("#loader").hide();
        },
        error: function (error) {
            console.error("Error uploading image:", error);

            // 로딩 스피너 숨기기
            $("#loader").hide();
        },
    });
}
