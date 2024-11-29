// Slider open and Close
$(".slider").click(function () {
  $(this).parent().toggleClass("settings-open");
});

$(".reco-label").click(function () {
  $(this).parent().find(".reco-slide").toggleClass("reco-open");
  $(this).toggleClass("reco-open");
});

$(".param-label").click(function () {
  $(this).find(".reco-slide").toggleClass("reco-open");
  $(this).find("i").toggleClass("reco-open");
});
