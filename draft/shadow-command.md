* yum install m2crypto python-setuptools
* easy_install pip
```
如果系统默认没有 easy_install
则先执行
wget https://bootstrap.pypa.io/ez_setup.py -O - | python
```
* pip install shadowsocks
* vi /etc/shadowsocks.json

`复制下面的JSON, port 和password 自定`
```json
{
    "server": "0.0.0.0",
    "port_password": {
        "5678": "your_password"
    },
    "timeout": 300,
    "method": "aes-256-cfb"
}
```
* yum install firewalld
* firewall-cmd --permanent --zone=public --add-port=5678/tcp
* firewall-cmd --zone=public --add-port=80/tcp --permanent
* firewall-cmd --zone=public --add-port=443/tcp --permanent
* firewall-cmd --reload
* ssserver -c /etc/shadowsocks.json -d start

===================================

## easy quick method
```text
yum install wget

wget –no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh

chmod +x shadowsocks.sh

./shadowsocks.sh 2>&1 | tee shadowsocks.log

# 加速

wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh

chmod +x bbr.sh

./bbr.sh

# 输入lsmod | grep bbr 看到tcp_bbr代表成功了
 
 
 (多用户设置 记得改防火墙)
```
