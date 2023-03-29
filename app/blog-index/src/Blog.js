import React, { useEffect, useRef, useState } from 'react';
import {
  AlgorithmIcon,
  AnimateIcon,
  BaseIcon,
  CanvasIcon,
  CompIcon,
  CSSIcon,
  GameIcon,
  // HTML5Icon,
  UtilIcon,
  JSIcon,
  MathIcon,
  TextIcon
} from './icon';

import './Blog.scss';


const Blog = () => {

  const [filteredPosts, setFilteredPosts] = useState([]);
  const blogUrlMapRef = useRef({});

  const handleClick = (e) => {
    const tag = e.target.tagName.toLowerCase();
    let li;
    switch (tag) {
      case 'li':
        li = e.target;
        break;
      default:
        li = e.target.parentNode;
    }
    const category = li.className.split('-')[1];
    const titles = window.BlogTags[category];
    setFilteredPosts(titles.map((title) => ({
      title: title,
      url: blogUrlMapRef.current[title]
    })))
  };

  useEffect(() => {
    [...document.querySelectorAll('.post-list a')].forEach((post) => {
      blogUrlMapRef.current[post.innerText.trim()] = post.href;
    });
  }, []);

  return (
    <div className="blog-wrap">
      <h1 className="blog-title">帷幕的博客</h1>
      <ul className="blog-category-list" onClick={handleClick}>
        <li className="category-algorithm">
          <i className="blog-icon">
            <AlgorithmIcon/>
          </i>
          <p>算法</p>
        </li>
        <li className="category-canvas">
          <i className="blog-icon">
            <CanvasIcon/>
          </i>
          <p>Canvas</p>
        </li>
        <li className="category-animate">
          <i className="blog-icon">
            <AnimateIcon/>
          </i>
          <p>动画</p>
        </li>
        <li className="category-base">
          <i className="blog-icon">
            <BaseIcon/>
          </i>
          <p>基础</p>
        </li>
        <li className="category-comp">
          <i className="blog-icon">
            <CompIcon/>
          </i>
          <p>组件</p>
        </li>
        <li className="category-css">
          <i className="blog-icon">
            <CSSIcon/>
          </i>
          <p>CSS</p>
        </li>
        <li className="category-js">
          <i className="blog-icon">
            <JSIcon/>
          </i>
          <p>Javascript</p>
        </li>
        <li className="category-game">
          <i className="blog-icon">
            <GameIcon/>
          </i>
          <p>小游戏</p>
        </li>
        <li className="category-math">
          <i className="blog-icon">
            <MathIcon/>
          </i>
          <p>数学</p>
        </li>
        <li className="category-util">
          <i className="blog-icon">
            <UtilIcon/>
          </i>
          <p>工具</p>
        </li>
        <li className="category-text">
          <i className="blog-icon">
            <TextIcon/>
          </i>
          <p>杂文</p>
        </li>
      </ul>

      <ol className="blog-list">
        {
          filteredPosts.map((post) => {
            return (
              <li key={post.title}><a href={post.url} target="_blank">{post.title}</a></li>
            )
          })
        }
      </ol>
    </div>
  );
};

export default Blog;