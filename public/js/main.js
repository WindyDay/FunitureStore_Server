const STORE = {
    init: function () {
        this.initSlide();
    },
    exec: function () {},
    initSlide: function () {
        $('.slide').slick({
            arrows: false,
            dots: true,
            autoplay: true,
            autoplaySpeed: 2000,
            prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-arrow-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fas fa-arrow-right"></i></button>'
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    STORE.init();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiU1RPUkUiLCJpbml0IiwiaW5pdFNsaWRlIiwiZXhlYyIsIiQiLCJzbGljayIsImFycm93cyIsImRvdHMiLCJhdXRvcGxheSIsImF1dG9wbGF5U3BlZWQiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFFBQVE7QUFDVkMsVUFBTSxZQUFZO0FBQ2QsYUFBS0MsU0FBTDtBQUNILEtBSFM7QUFJVkMsVUFBTSxZQUFZLENBRWpCLENBTlM7QUFPVkQsZUFBVyxZQUFZO0FBQ25CRSxVQUFFLFFBQUYsRUFBWUMsS0FBWixDQUFrQjtBQUNkQyxvQkFBUSxLQURNO0FBRWRDLGtCQUFNLElBRlE7QUFHZEMsc0JBQVUsSUFISTtBQUlkQywyQkFBZSxJQUpEO0FBS2RDLHVCQUFXLHFGQUxHO0FBTWRDLHVCQUFXO0FBTkcsU0FBbEI7QUFRSDtBQWhCUyxDQUFkOztBQW1CQUMsU0FBU0MsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVk7QUFDdERiLFVBQU1DLElBQU47QUFDSCxDQUZEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTVE9SRSA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmluaXRTbGlkZSgpO1xyXG4gICAgfSxcclxuICAgIGV4ZWM6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgaW5pdFNsaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLnNsaWRlJykuc2xpY2soe1xyXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b3BsYXlTcGVlZDogMjAwMCxcclxuICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PGkgY2xhc3M9XCJmYXMgZmEtYXJyb3ctbGVmdFwiPjwvaT48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48aSBjbGFzcz1cImZhcyBmYS1hcnJvdy1yaWdodFwiPjwvaT48L2J1dHRvbj4nXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgU1RPUkUuaW5pdCgpO1xyXG59KTsiXX0=
