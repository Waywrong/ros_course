from setuptools import setup

package_name = 'w06_service'

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
    description='W06 service',
    license='MIT',
    entry_points={
        'console_scripts': [
            'add_server = w06_service.add_server:main',
            'add_client = w06_service.add_client:main',
        ],
    },
)
