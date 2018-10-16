* yum install m2crypto python-setuptools
* easy_install pip
```
如果系统默认没有 easy_install
则先执行
wget https://bootstrap.pypa.io/ez_setup.py -O - | python
```
* pip install shadowsocks
* vi  /etc/shadowsocks.json
* yum install firewalld
* firewall-cmd --permanent --zone=public --add-port=1234/tcp
* firewall-cmd --zone=public --add-port=80/tcp --permanent
* firewall-cmd --zone=public --add-port=443/tcp --permanent
* firewall-cmd --reload
* ssserver -c /etc/shadowsocks.json -d start