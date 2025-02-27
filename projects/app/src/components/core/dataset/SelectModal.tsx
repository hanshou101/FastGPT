import { getDatasets, getDatasetPaths } from '@/web/core/dataset/api';
import MyModal from '@/components/MyModal';
import { useQuery } from '@tanstack/react-query';
import React, { Dispatch, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { Box, Flex, ModalHeader } from '@chakra-ui/react';
import MyIcon from '@/components/Icon';

type PathItemType = {
  parentId: string;
  parentName: string;
};

const DatasetSelectContainer = ({
  isOpen,
  parentId,
  setParentId,
  paths,
  onClose,
  tips,
  children
}: {
  isOpen: boolean;
  parentId?: string;
  setParentId: Dispatch<string>;
  paths: PathItemType[];
  onClose: () => void;
  tips?: string | null;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const { isPc } = useSystemStore();

  return (
    <MyModal isOpen={isOpen} onClose={onClose} w={'100%'} maxW={['90vw', '900px']} isCentered>
      <Flex flexDirection={'column'} h={'90vh'}>
        <ModalHeader>
          {!!parentId ? (
            <Flex
              flex={1}
              userSelect={'none'}
              fontSize={['sm', 'lg']}
              fontWeight={'normal'}
              color={'myGray.900'}
            >
              {paths.map((item, i) => (
                <Flex key={item.parentId} mr={2} alignItems={'center'}>
                  <Box
                    fontSize={'lg'}
                    borderRadius={'md'}
                    {...(i === paths.length - 1
                      ? {
                          cursor: 'default'
                        }
                      : {
                          cursor: 'pointer',
                          _hover: {
                            color: 'myBlue.600'
                          },
                          onClick: () => {
                            setParentId(item.parentId);
                          }
                        })}
                  >
                    {item.parentName}
                  </Box>
                  {i !== paths.length - 1 && (
                    <MyIcon name={'rightArrowLight'} color={'myGray.500'} w={['18px', '24px']} />
                  )}
                </Flex>
              ))}
            </Flex>
          ) : (
            <Box>{t('chat.Select Mark Kb')}</Box>
          )}
          {!!tips && (
            <Box fontSize={'sm'} color={'myGray.500'} fontWeight={'normal'}>
              {tips}
            </Box>
          )}
        </ModalHeader>
        <Box flex={'1 0 0'}>{children}</Box>
      </Flex>
    </MyModal>
  );
};

export function useDatasetSelect() {
  const { t } = useTranslation();
  const [parentId, setParentId] = useState<string>();

  const { data, isLoading } = useQuery(['loadDatasetData', parentId], () =>
    Promise.all([getDatasets({ parentId }), getDatasetPaths(parentId)])
  );

  const paths = useMemo(
    () => [
      {
        parentId: '',
        parentName: t('dataset.My Dataset')
      },
      ...(data?.[1] || [])
    ],
    [data, t]
  );

  return {
    parentId,
    setParentId,
    datasets: data?.[0] || [],
    paths,
    isLoading
  };
}

export default DatasetSelectContainer;
