const σ = 1;
const ImgUtil = {
    gsBlur: (x) => {
        return Math.pow(Math.E / (σ * Math.sqrt(2 * Math.PI)), - x * x / (2 * σ * σ));
    }
};


for (var i = 0; i < 10; i++) {
    console.log(ImgUtil.gsBlur(i));
}
