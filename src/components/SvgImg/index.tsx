import { useEffect } from 'react';
// import SVGInject from '@/utils/svgInject';
import { ReactSVG } from 'react-svg';
import './index.less';

const SvgImg = (props: any) => {
  const { src, ...rest } = props;
  return <ReactSVG src={src} {...rest} />;
};

export default SvgImg;
