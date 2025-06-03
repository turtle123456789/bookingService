import React, { useEffect } from 'react'
import Slider from 'react-slick'
import CartProduct from '../CartProduct/CartProduct';
import { fetchServicesThunk } from '../../redux/serviceSlice';
import { useDispatch, useSelector } from 'react-redux';
const SlideService = () => {
    const dispatch = useDispatch();
    const {  services } = useSelector((state) => state.service);
    useEffect(() => {
      dispatch(fetchServicesThunk());
    }, [dispatch]);
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
            {services?.slice(0, 36).map((item) => (
            <CartProduct
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                description={item.description}
                price={item.price}
            />
            ))}
      </Slider>
    </div>
  )
}

export default SlideService