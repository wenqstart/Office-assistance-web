import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface SetGroupProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const SetGroup: React.FC<PropsWithChildren<SetGroupProps>> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="设置分组"
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <div style={{width: '400px'}}>{props.children}</div>
    </Modal>
  );
};

export default SetGroup;
