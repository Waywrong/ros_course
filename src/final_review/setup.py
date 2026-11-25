from setuptools import setup

package_name = 'final_review'

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
    description='期末考前複習：猜數字 service',
    license='MIT',
    entry_points={
        'console_scripts': [
            'guess_server = final_review.guess_server:main',
            'guess_client = final_review.guess_client:main',
        ],
    },
)
