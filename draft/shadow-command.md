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