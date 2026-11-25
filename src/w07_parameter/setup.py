import os
from glob import glob
from setuptools import setup

package_name = 'w07_parameter'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'), glob('launch/*.launch.py')),
        (os.path.join('share', package_name, 'config'), glob('config/*.yaml')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='course',
    maintainer_email='noreply@example.com',
    description='W07 parameter',
    license='MIT',
    entry_points={
        'console_scripts': [
            'my_node04 = w07_parameter.my_node04:main',
        ],
    },
)
