from setuptools import setup

package_name = 'w05_node'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='course',
    maintainer_email='noreply@example.com',
    description='W05 一般程式改成 ROS node',
    license='MIT',
    entry_points={
        'console_scripts': [
            'plain_counter = w05_node.plain_counter:main',
            'counter_node = w05_node.counter_node:main',
            'cmd_listener = w05_node.cmd_listener:main',
        ],
    },
)
