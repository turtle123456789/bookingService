import React from 'react'
import Slider from 'react-slick'
import { bg1 } from '../../units/importImg';
import CartProduct from '../CartProduct/CartProduct';
const services = [
  {
    id: 1,
    title: "Quần áo basic",
    description: "Dịch vụ nhỏ nhằm đáp ứng nhu cầu cơ bản...",
    price: "50.000",
    image: bg1,
  },
  {
    id: 2,
    title: "Dịch vụ in logo",
    description: "In logo theo yêu cầu lên sản phẩm...",
    price: "70.000",
    image: bg1,
  },
  {
    id: 3,
    title: "Thiết kế đồng phục",
    description: "Tư vấn và thiết kế đồng phục chuyên nghiệp...",
    price: "150.000",
    image: bg1,
  },
  {
    id: 4,
    title: "Tư vấn phối đồ",
    description: "Chuyên gia thời trang hỗ trợ phối đồ đẹp...",
    price: "100.000",
    image: bg1,
  },
  {
    id: 4,
    title: "Tư vấn phối đồ",
    description: "Chuyên gia thời trang hỗ trợ phối đồ đẹp...",
    price: "100.000",
    image: bg1,
  },
   {
    id: 4,
    title: "Tư vấn phối đồ",
    description: "Chuyên gia thời trang hỗ trợ phối đồ đẹp...",
    price: "100.000",
    image: bg1,
  },
   {
    id: 4,
    title: "Tư vấn phối đồ",
    description: "Chuyên gia thời trang hỗ trợ phối đồ đẹp...",
    price: "100.000",
    image: bg1,
  },
   {
    id: 4,
    title: "Tư vấn phối đồ",
    description: "Chuyên gia thời trang hỗ trợ phối đồ đẹp...",
    price: "100.000",
    image: bg1,
  },
   {
    id: 4,
    title: "Tư vấn phối đồ",
    description: "Chuyên gia thời trang hỗ trợ phối đồ đẹp...",
    price: "100.000",
    image: bg1,
  },
];

const SlideService = () => {
    
    var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    initialSlide: 0,
    responsive: [
        {
        breakpoint: 1024,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
        }
        },
        {
        breakpoint: 600,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
        }
        },
        {
        breakpoint: 480,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
        }
    ]
    };
  return (
    <div className="slider-container px-20">
        <Slider {...settings}>
            {services.map((item) => (
            <CartProduct
                key={item.id}
                id={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                price={item.price}
            />
            ))}
      </Slider>
    </div>
  )
}

export default SlideService