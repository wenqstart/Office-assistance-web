


# 基础镜像
FROM nginx
#创建app目录
WORKDIR /app
# 作者
MAINTAINER wqstart
#将打包后的dict目录复制到容器的app目录下
COPY ./dist/  /app
# 用自定义的nginx.conf 去覆盖镜像中原本的nginx.conf配置u文件
ADD ./nginx.conf /etc/nginx/nginx.conf
#暴露80端口，也就是会在服务器上的80端口提供你的项目(这个端口可以设置为其他的，别和其他的端口重复就行)
EXPOSE 8000

