import os
from glob import glob
from setuptools import setup

package_name = 'w09_launch'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'), glob('launch/*.launch.py')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='course',
    maintainer_email='noreply@example.com',
    description='W09 launch 與 rosbag',
    license='MIT',
    entry_points={
        'console_scripts': [
        ],
    },
)
