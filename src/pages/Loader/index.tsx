import LoadingPage from '@/pages/LoadingPage';

const Loader = (props: any) => {
  const { isLoading } = props;
  if (isLoading) {
    return <LoadingPage style={{ height: '100vh' }} />;
  }
};

export default Loader;
