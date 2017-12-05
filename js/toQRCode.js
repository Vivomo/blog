var $qrValue = $('#qr-value');
$qrValue.focus();

$('#run').click(function () {
    $('#qr-wrap').qrcode({
        width: 200,
        height: 200,
        text: $qrValue.val()
    });
});