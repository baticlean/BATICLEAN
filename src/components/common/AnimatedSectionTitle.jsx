import React, { useState, useEffect, useRef } from 'react';

const AnimatedSectionTitle = ({
  children,
  text,
  className = "text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight",
  tag: Tag = "h2"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderAnimatedText = (content) => {
    if (typeof content !== 'string') return content;

    let charIndexCounter = 0;
    return content.split(' ').map((word, wordIdx) => (
      <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
        {word.split('').map((char, charIdx) => {
          const delay = charIndexCounter * 0.022; // 22ms d'intervalle entre chaque lettre
          charIndexCounter++;
          return (
            <span
              key={charIdx}
              style={{ animationDelay: `${delay}s` }}
              className={`sweep-letter ${isVisible ? 'animate' : ''}`}
            >
              {char}
            </span>
          );
        })}
      </span>
    ));
  };

  const processChildren = (node) => {
    if (typeof node === 'string') {
      return renderAnimatedText(node);
    }
    if (Array.isArray(node)) {
      return node.map((child, idx) => <React.Fragment key={idx}>{processChildren(child)}</React.Fragment>);
    }
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        children: processChildren(node.props.children),
      });
    }
    return node;
  };

  return (
    <Tag ref={titleRef} className={className}>
      {text ? renderAnimatedText(text) : processChildren(children)}
    </Tag>
  );
};

export default AnimatedSectionTitle;
