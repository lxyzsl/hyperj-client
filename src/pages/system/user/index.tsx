import { getSystemUserList, remove, setSystemStatus } from '@/services/system/user';
import { PageContainer } from '@ant-design/pro-layout'
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table'
import {  message, Modal, Popconfirm, Space, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import {Access} from 'umi';
import Storage from '@/constants/storage'
import { hasPerms } from '@/utils/permission';


const SystemUserList:React.FC = () => {

    const actionRef = useRef<ActionType>();



    const reloadData = () =>{
        actionRef.current!.reload();
    }


     /**
     * 启用/停用
     * @param courseId 课程ID
     * @param checked 是否启用
     */
    const changeEnabeld = async (userId: string,checked:boolean) =>{
        const status = checked ? "1" :"0"
        const result = await setSystemStatus(userId,status)
        if(result.success){
            actionRef.current!.reload();
            message.success("操作成功")
        }
    }

    /**
     * 删除
     */
    const handleRemoveOne = async (userId: string) => {
        const hide = message.loading('正在删除');
        const result = await remove(userId);
        if(result.success){
            hide();
            message.success('删除成功');
            actionRef.current?.reload();
        }
      };


    const columns: ProColumns<ApiResp.System.User.UserInterface>[] = [
        {
            title: "ID",
            dataIndex: 'userId',
            valueType: 'textarea',
            hideInSearch: true,
        },
        {
            title: "手机号码",
            dataIndex: 'mobile',
            valueType: 'text',
          },
        {
            title: "用户名",
            dataIndex: 'userName',
            valueType: 'text',
        },
        {
            title: "用户邮箱",
            dataIndex: 'email',
            valueType: 'text',
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                0: { text: '停用', status: 'Default' },
                1: { text: '启用', status: 'Success' },
            
            },
            valueType: 'checkbox',
            render:(_,entity)=>(
                <Switch disabled={entity.root === "1" }  defaultChecked={entity.status==="1"}  onChange={(checked:boolean)=>changeEnabeld(entity.userId,checked)} size="small"/>
            ),
            width: "sm"
        },
        {
            title: '操作',
            dataIndex: 'option',
            width: '180px',
            valueType: 'option',
            render: (_, record) => {
                return (
                    <Space>
                        <Access accessible={hasPerms("system:user:edit")  && record.root !== "1"}>
                            <a key="edit" >编辑 </a>
                        </Access>
                        <Access accessible={hasPerms("system:user:remove") && record.root !== "1"}>
                            <Popconfirm
                                placement="topRight"
                                title="确定删除该项吗？"
                                onConfirm={()=>handleRemoveOne(record.userId)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <a key="batchRemove" className="error-color" > 删除 </a>
                            </Popconfirm>
                        </Access>
                        <Access accessible={hasPerms("system:user:resetPwd") && record.root !== "1"}>
                            <a key="resetpwd" > 密码重置</a>
                        </Access>
                    </Space>
                )
            }
        }
    ]

    return (
        <PageContainer>
            <div style={{ width: '20%', height: '100%', float: 'left' }}>
                部门相关
            </div>
            <div style={{ width: '79%', float: 'right' }}>
                <ProTable<ApiResp.System.User.UserInterface>
                    actionRef={actionRef}
                    columns={columns}
                    rowKey="userId"
                    request={getSystemUserList}
                />
            </div>
        </PageContainer> 
    )
}

export default SystemUserList